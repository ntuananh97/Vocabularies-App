
import { API_ENDPOINTS } from '@/configs/api';
import { BASE_URL } from '@/helpers/axios/axios';
import Review from '@/views/pages/review';
import NotFoundTopic from '@/views/pages/topic/NotFoundTopic';
import { cookies } from "next/headers";
import React from 'react'

interface IReviewPage {
  params: {
    topicId: string
  }
}

export default async function ReviewPage  ({ params }: IReviewPage) {
  if (!params?.topicId) return <NotFoundTopic />

  const data = await fetch(`${BASE_URL}${API_ENDPOINTS.TOPIC.INDEX}/${params.topicId}`, {
    headers: { Cookie: cookies().toString() },
    credentials: 'include',
  })
  const response = await data.json();
  console.log("ReviewPage ~ response:", response)
  const topicData = response.data || {};
  console.log("ReviewPage ~ topicData:", topicData)

  return (
    <div>
      { topicData._id ? <Review topicData={topicData}  /> : <NotFoundTopic /> }
    </div>
  )
}
