# frozen_string_literal: true

class SimulationChannel < ApplicationCable::Channel
  def subscribed
    simulation_run = SimulationRun.find_by(id: params[:simulation_run_id])
    if simulation_run
      stream_from "simulation_#{simulation_run.id}"
    else
      reject
    end
  end

  def unsubscribed
    # Any cleanup when channel is unsubscribed
  end
end
