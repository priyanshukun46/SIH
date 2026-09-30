# frozen_string_literal: true

module Api
  module V1
    class TasksController < ApplicationController
      def index
        tasks = if params[:warehouse_id]
                  Task.where(warehouse_id: params[:warehouse_id]).order(:id)
                else
                  Task.all.order(:id)
                end
        render json: tasks.as_json(include: :assigned_robot)
      end

      def create
        warehouse = Warehouse.find(task_params[:warehouse_id])
        task = warehouse.tasks.create!(task_params)

        # Broadcast task creation
        ActionCable.server.broadcast("simulation_task", {
          type: 'task_created',
          task: task
        })

        render json: task, status: :created
      rescue ActiveRecord::RecordInvalid => e
        render json: { error: e.record.errors.full_messages }, status: :unprocessable_entity
      end

      private

      def task_params
        params.require(:task).permit(
          :warehouse_id, :name, :pickup_x, :pickup_y,
          :destination_x, :destination_y, :priority
        )
      end
    end
  end
end
