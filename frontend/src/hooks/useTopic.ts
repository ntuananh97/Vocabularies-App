'use client';

import { useState } from "react";
import { handleErrorResponse } from "@/helpers/response";
import { getTopics } from "@/services/topic";
import { useStore } from "@/store";
import { TUseTopicParams } from "@/types/topic";
import { TQueryParams } from "@/types/common";

const useTopic = (props: TUseTopicParams = {}) => {
  const [loading, setLoading] = useState(false);
  const { setTopics } = useStore();

  const getAllTopics = async () => {

    setLoading(true);

    try {
      const type = props.type
      const params: TQueryParams = {}
      if (type) params.filter = JSON.stringify({type});

      const response = await getTopics(params);
      setTopics(response.data.list);

    } catch (error) {
      handleErrorResponse(error);
    }

    setLoading(false);
  };


  return {
    getAllTopics,
    loading,
  };
};

export default useTopic;
