import React, { useState } from 'react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    pickup_x: number;
    pickup_y: number;
    destination_x: number;
    destination_y: number;
    priority: number;
  }) => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('Urgent Pallet Dispatch');
  const [pickupX, setPickupX] = useState(5);
  const [pickupY, setPickupY] = useState(1);
  const [destX, setDestX] = useState(12);
  const [destY, setDestY] = useState(18);
  const [priority, setPriority] = useState(4);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      pickup_x: Number(pickupX),
      pickup_y: Number(pickupY),
      destination_x: Number(destX),
      destination_y: Number(destY),
      priority: Number(priority)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 font-sans text-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative text-slate-700">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer text-sm w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-5">
          <h2 className="text-[#212121] font-bold text-base">New Task</h2>
          <p className="text-slate-400 text-[11px] mt-0.5">Dispatch an order to the fleet</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-500 mb-1.5 text-[11px] font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF471D]/20 transition-shadow"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 mb-1.5 text-[11px] font-medium">Pickup (X, Y)</label>
              <div className="flex gap-2">
                <input type="number" min="0" max="29" value={pickupX} onChange={(e) => setPickupX(Number(e.target.value))} className="w-full bg-slate-50 rounded-lg px-2.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF471D]/20" placeholder="X" required />
                <input type="number" min="0" max="19" value={pickupY} onChange={(e) => setPickupY(Number(e.target.value))} className="w-full bg-slate-50 rounded-lg px-2.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF471D]/20" placeholder="Y" required />
              </div>
            </div>
            <div>
              <label className="block text-slate-500 mb-1.5 text-[11px] font-medium">Dropoff (X, Y)</label>
              <div className="flex gap-2">
                <input type="number" min="0" max="29" value={destX} onChange={(e) => setDestX(Number(e.target.value))} className="w-full bg-slate-50 rounded-lg px-2.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF471D]/20" placeholder="X" required />
                <input type="number" min="0" max="19" value={destY} onChange={(e) => setDestY(Number(e.target.value))} className="w-full bg-slate-50 rounded-lg px-2.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF471D]/20" placeholder="Y" required />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-500 mb-1.5 text-[11px] font-medium">Priority</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setPriority(lvl)}
                  className={`flex-1 py-1.5 text-xs transition-colors cursor-pointer rounded-lg ${
                    priority === lvl
                      ? 'bg-slate-800 text-white font-bold'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  P{lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#FF471D] hover:bg-[#e03d15] text-white font-bold rounded-lg text-xs cursor-pointer transition-colors"
            >
              Dispatch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
