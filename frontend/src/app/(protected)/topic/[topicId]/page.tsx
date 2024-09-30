
import { API_ENDPOINTS } from '@/configs/api';
import { BASE_URL } from '@/helpers/axios/axios';
import Review from '@/views/pages/review';
import { cookies } from "next/headers";
import React from 'react'

interface IReviewPage {
  params: {
    topicId: string
  }
}

export default async function ReviewPage  ({ params }: IReviewPage) {
  const data = await fetch(`${BASE_URL}${API_ENDPOINTS.TOPIC.INDEX}/${params.topicId}`, {
    headers: { Cookie: cookies().toString() },
  })
  const response = await data.json();
  const topicData = response.data;

  return (
    <div>
      { topicData._id ? <Review topicData={topicData}  /> : <h1 className='text-center text-red-500'>Topic not found</h1> }
    </div>
  )
}
