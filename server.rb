require "sinatra"
require 'sinatra/cross_origin'
require "mongo"
require "json/ext"
require "stripe"

configure do
  # Enable CORS
  enable :cross_origin

  db = Mongo::Client.new('mongodb://root:root@ds161245.mlab.com:61245/bill_splitter_dev')
  set(:db, db)

  stripeKey = "sk_test_blOpKO4rdEiiqxB3MxsNjb9p"
  Stripe.api_key = stripeKey
end

helpers do
    # a helper method to turn a string ID
    # representation into a BSON::ObjectId
    def object_id val
        begin
            BSON::ObjectId.from_string(val)
        rescue BSON::ObjectId::Invalid
            nil
        end
    end

    def document_by_id(collection,id)
        id = object_id(id) if String === id
        if id.nil?
            nil
        else
            document = settings.db[collection].find(:_id => id).to_a.first
            (document || nil)
        end
    end
end

before do
  if request.request_method == 'POST' || request.request_method == 'PUT'
    request.body.rewind
    @request_payload = JSON.parse(request.body.read)
  end
end


options "*" do
  response.headers["Access-Control-Allow-Methods"] = "HEAD,GET,PUT,DELETE,OPTIONS"

  # Needed for AngularJS
  response.headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept"

  200
end

get '/' do
    send_file 'ui/app/index.html'
end

get '/housemates/:id' do
    # Get a housemate
    content_type :json
    {:success => true, :housemate => document_by_id(:housemates, params[:id])}.to_json
end

get '/housemates' do
    # Get housemates
    content_type :json
    {:success => true, :housemates => settings.db[:housemates].find.to_a}.to_json
end

post '/housemates' do
    # Create new housemates
    content_type :json

    puts @request_payload

    # Get CC information
    card = @request_payload["card"]

    begin

      card = {
        :number     => card["number"],
        :exp_month  => card["exp_month"],
        :exp_year   => card["exp_year"],
        :cvc        => card["cvc"]
      }

      token = Stripe::Token.create(
        :card => card
      )

      # Create record to save to DB with the token.id
      record = {
        :name => @request_payload["name"],
        :email => @request_payload["email"],
        :card => card
      }

      # Save above record to DB
      result = settings.db[:housemates].insert_one record
      inserted_record = settings.db[:housemates].find(:_id => result.inserted_id).to_a.first
      {:success => true, :housemate => inserted_record}.to_json
    rescue Exception => e
      {:success => false, :error => e.message}.to_json
    end
end

put '/housemates/:id/info' do
    # Update an existing housemate information
    content_type :json
    id = object_id(params[:id])
    settings.db[:housemates].find(:_id => id).
      find_one_and_update('$set' => @request_payload)
    {:success => true, :housemate => document_by_id(:housemates, id)}.to_json
end

put '/housemates/:id/cc' do
  # Update a housemate's CC
  content_type :json

  puts @request_payload

  begin

    card = {
      :number     => @request_payload["number"],
      :exp_month  => @request_payload["exp_month"],
      :exp_year   => @request_payload["exp_year"],
      :cvc        => @request_payload["cvc"]
    }

    token = Stripe::Token.create(
      :card => card
    )

    # Save the updated token to DB
    settings.db[:housemates].find(:_id => object_id(params[:id])).
      find_one_and_update('$set' => {:card => card})
    {:success => true, :housemate => document_by_id(:housemates, params[:id])}.to_json
  rescue Exception => e
    {:success => false, :error => e.message}.to_json
  end
end

delete '/housemates/:id' do
  # Deleting a housemate
  content_type :json

  id = object_id(params[:id])
  documents = settings.db[:housemates].find(:_id => id)
  if !documents.nil?
    documents.find_one_and_delete
    {:success => true}.to_json
  else
    {:success => false}.to_json
  end
end

# Charge a single housemate
put '/charge' do
  # Charge a housemate

  content_type :json

  # Get the bill by id
  bill_id = @request_payload["bill_id"]
  bill = document_by_id(:bills, bill_id)

  # Get the housemates and the cc token
  housemate_id = @request_payload["housemate_id"]
  housemate = document_by_id(:housemates, housemate_id)

  # Calculate the housemates share
  share = bill["amount"] / bill["housemates"].length

  begin

    source = housemate["card"]
    source["object"] = "card"

    charge = {
      :amount => share * 100, # Convert $s to cents
      :currency => "usd",
      :source => source,
      :description => bill["description"]
    }

    striped_charge = Stripe::Charge.create(charge)

    if striped_charge["failure_code"].nil?

      # Update the bill
      bill_housemates = bill["housemates"]
      bill_housemates[housemate_id] = striped_charge["id"]
      settings.db[:bills].find(:_id => object_id(bill_id)).
        find_one_and_update('$set' => {'housemates': bill_housemates})

      {:success => true, :bill => document_by_id(:bills, bill_id)}.to_json
    else
      err_code = striped_charge["failure_code"]
      err_msg = striped_charge["failure_message"]
      {:success => false, :error => "Stripe charge failed with #{err_code}:#{err_msg}"}
    end

  rescue Exception => e
    {:success => false, :error => e.message}.to_json
  end
end

get '/bills/:id' do
    # Get a bill
    content_type :json

    {:success => true, :bill => document_by_id(:bills, params[:id])}.to_json
end

get '/bills' do
    # Get all bills
    content_type :json

    {:success => true, bills: settings.db[:bills].find.to_a}.to_json
end

post '/bills' do
  # Create a new bill
  content_type :json
  bill = {
    :amount => @request_payload["amount"],
    :description => @request_payload["description"],
    :housemates => {
      # housemate_id => true/false
    }
  }

  settings.db[:housemates].find.each do |housemate|
    bill[:housemates][housemate[:_id].to_s] = false
  end

  result = settings.db[:bills].insert_one bill
  inserted_record = settings.db[:bills].find(:_id => result.inserted_id).to_a.first

  {:success => true, :bill => inserted_record}.to_json
end

delete '/bills/:id' do
  # Deleting a bill
  content_type :json

  id = object_id(params[:id])
  documents = settings.db[:bills].find(:_id => id)
  if !documents.to_a.first.nil?
    documents.find_one_and_delete
    {:success => true}.to_json
  else
    {:success => false}.to_json
  end
end
