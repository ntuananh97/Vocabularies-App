import { create } from 'zustand'
import { createTopicSlice, ITopicSlice } from './topicStore'

type TStoreState = ITopicSlice

export const useStore = create<TStoreState>()((...a) => ({
  ...createTopicSlice(...a),
}))