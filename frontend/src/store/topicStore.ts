import { TTopicType } from '@/types/topic'
import { StateCreator } from 'zustand'

type TListTopic = TTopicType[]

export interface ITopicSlice  {
  topics: TListTopic
  setTopics: (_T: TListTopic) => void
}

export const createTopicSlice: StateCreator<ITopicSlice> = (set) => ({
  topics: [],
  setTopics: (topics) => set({ topics }),
})