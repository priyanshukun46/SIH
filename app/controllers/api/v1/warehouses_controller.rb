# frozen_string_literal: true

module Api
  module V1
    class WarehousesController < ApplicationController
      def index
        warehouses = Warehouse.all
        render json: warehouses
      end

      def show
        warehouse = Warehouse.find(params[:id])
        render json: {
          warehouse: warehouse,
          robots: warehouse.robots.order(:id),
          tasks: warehouse.tasks.order(:id),
          obstacles: warehouse.obstacles.active,
          simulation_runs: warehouse.simulation_runs.order(created_at: :desc).limit(5)
        }
      end
    end
  end
end
