# frozen_string_literal: true

require 'rails_helper'

RSpec.describe "Api::V1::Simulations", type: :request do
  let!(:warehouse) { Simulation::ScenarioBuilder.build_default_warehouse }
  let!(:sim_run) { warehouse.simulation_runs.create!(mode: 'DISTRIBUTED', status: 'IDLE') }

  describe "GET /api/v1/simulations/:id" do
    it "returns simulation details and active robots" do
      get "/api/v1/simulations/#{sim_run.id}"
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json['simulation_run']['id']).to eq(sim_run.id)
      expect(json['robots']).not_to be_empty
    end
  end

  describe "POST /api/v1/simulations/:id/step" do
    it "executes a step and returns updated tick" do
      post "/api/v1/simulations/#{sim_run.id}/step"
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json['step_result']['tick']).to eq(1)
    end
  end

  describe "POST /api/v1/simulations/:id/block_aisle" do
    it "dynamically blocks an aisle coordinate" do
      post "/api/v1/simulations/#{sim_run.id}/block_aisle", params: { x: 8, y: 6, width: 2, height: 1 }
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json['message']).to include("Aisle blocked at (8, 6)")
    end
  end
end
