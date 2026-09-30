# frozen_string_literal: true

module Api
  module V1
    class RobotsController < ApplicationController
      def index
        robots = if params[:warehouse_id]
                   Robot.where(warehouse_id: params[:warehouse_id]).order(:id)
                 else
                   Robot.all.order(:id)
                 end
        render json: robots.as_json(include: :current_task)
      end

      def show
        robot = Robot.find(params[:id])
        recent_states = robot.robot_states.order(tick: :desc).limit(30)
        recent_routes = robot.routes.order(created_at: :desc).limit(5)

        render json: {
          robot: robot.as_json(include: :current_task),
          recent_states: recent_states,
          recent_routes: recent_routes
        }
      end
    end
  end
end
