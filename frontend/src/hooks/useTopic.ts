'use client';

import { useState } from "react";
import { handleErrorResponse } from "@/helpers/response";
import { getTopics } from "@/services/topic";
import { useStore } from "@/store";

const useTopic = () => {
  const [loading, setLoading] = useState(false);
  const { setTopics } = useStore();

  const getAllTopics = async () => {
  
    setLoading(true);

    try {
     const response = await getTopics();
     setTopics(response.data);
      
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
