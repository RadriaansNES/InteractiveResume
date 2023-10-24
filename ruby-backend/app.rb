require 'sinatra'
require 'sinatra/base'
require 'sinatra/reloader' if development?
require 'securerandom'
require 'google/cloud/dialogflow'

ENV['GOOGLE_APPLICATION_CREDENTIALS'] = File.expand_path('resumechatbot-402917-c4515d65b60f.json', __dir__)

VUE_FRONTEND_DIR = File.expand_path(File.join(File.dirname(__FILE__), '..', 'vue-frontend', 'dist'))

class App < Sinatra::Base
  get '/' do
    File.read(File.join(VUE_FRONTEND_DIR, 'index.html'))
  end

  get '/js/*' do |path|
    send_file File.join(VUE_FRONTEND_DIR, 'js', path)
  end

  get '/css/*' do |path|
    send_file File.join(VUE_FRONTEND_DIR, 'css', path)
  end

  post '/dialogflow' do
    request_body = JSON.parse(request.body.read)
    user_message = request_body['message']

    session_id = SecureRandom.uuid

    begin
      dialogflow = Google::Cloud::Dialogflow::V2::SessionsClient.new

      response = dialogflow.detect_intent(
        session: "projects/resumechatbot-402917/locations/global/agents/ResumeAgent/sessions/#{session_id}",
        query_input: {
          text: {
            text: user_message,
            language_code: 'en-US',
          },
        },
      )

      bot_message = response.query_result.fulfillment_text
      { message: bot_message }.to_json
    rescue StandardError => e
      { error: e.message }.to_json
    end
  end

  run App.run!
end
