import { create } from "zustand";

export const useItineraryStore = create((set) => ({
  itinerary: [],
  addItem: (item) =>
    set((state) => ({ itinerary: [...state.itinerary, item] })),
  removeItem: (id) =>
    set((state) => ({
      itinerary: state.itinerary.filter((i) => i.id !== id),
    })),
}));
