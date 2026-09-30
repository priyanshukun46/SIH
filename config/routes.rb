Rails.application.routes.draw do
  mount ActionCable.server => '/cable'

  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      resources :warehouses, only: [:index, :show]
      resources :robots, only: [:index, :show]
      resources :tasks, only: [:index, :create]

      resources :simulations, only: [:create, :show] do
        member do
          post :start
          post :pause
          post :reset
          post :step
          post :block_aisle
          post :speed
          get :metrics
        end
        collection do
          post :demo
        end
      end

      get 'metrics/compare', to: 'metrics#compare'
      get 'metrics/benchmark', to: 'metrics#benchmark'
    end
  end

  # Fallback for client-side routing to index.html
  get "*path", to: proc {
    index_file = Rails.root.join("public", "index.html")
    if File.exist?(index_file)
      [200, { "Content-Type" => "text/html" }, [File.read(index_file)]]
    else
      [404, { "Content-Type" => "text/plain" }, ["Frontend not built yet"]]
    end
  }, constraints: ->(req) { !req.xhr? && req.format.html? }
end
