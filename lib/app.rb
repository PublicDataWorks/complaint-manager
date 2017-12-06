require 'sinatra'
configure { set :server, :puma }

set :views, Proc.new { File.join(root, "../build") }
set :public_folder, Proc.new { File.join(root, "../build") }

get '/' do
  render :html, :index
end
