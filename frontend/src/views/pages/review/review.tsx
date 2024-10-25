'use client';

import WordModal from '@/components/Modals/WordModal';
import {
  DATE_FORMAT,
  PAGE_SIZE,
  SORT_TYPE,
} from '@/configs/constants';
import { handleErrorResponse, handleSuccessResponse } from '@/helpers/response';
import { getWords, markWordAsReviewed } from '@/services/word';
import { TTopicType } from '@/types/topic';
import { TSearchWordParams, TWordSearchForm, TWordType } from '@/types/word';
import { Button, Flex, Grid, Image, Switch, Table, TableProps, Tooltip } from 'antd';
import {
  EditOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import WordSearch from './WordSearch';
import { ENABLE_USE_REVIEW, UN_ENABLE_USE_REVIEW } from '@/configs/words';
import SpeakTextWrapper from '@/components/SpeakTextWrapper';
import MoreAction from './MoreAction';
import WordInfoModal from '@/components/Modals/WordModal/WordInfoModal';
import PageContentLayout from '@/components/PageContentLayout';
import PageContentTitle from '@/components/PageContentLayout/PageContentTitle';
import NavLink from '@/app/nav-link';
import { REVIEW_TOPICS_BREADCRUMB } from '../topic/constants';
import { ROUTE_CONFIG } from '@/configs/route';

interface IReviewProps {
  topicData: TTopicType;
}
const { useBreakpoint } = Grid;
const initialEditWordData = {} as TWordType;
const ATTRIBUTES = "title,keyWord,pronounciation,definition,reviewCount,updatedAt,examples,images";

const Review: React.FC<IReviewProps> = ({ topicData }) => {
  const topicId = topicData._id;
  const screens = useBreakpoint();

  const [isOpenWordModal, setIsOpenWordModal] = useState(false);
  const [isOpenWordInfoModal, setIsOpenWordInfoModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviewWords, setReviewWords] = useState<TWordType[]>([]);

  const [editTopicData, setEditTopicData] =
    useState<TWordType>(initialEditWordData);
  const [pagination, setPagination] = useState<{
    current: number;
    total: number;
  }>({
    current: 1,
    total: 0,
  });

  const [filter, setFilter] = useState<TWordSearchForm>({} as TWordSearchForm);

  const [params, setParams] = useState<TSearchWordParams>({
    useReviewToday: ENABLE_USE_REVIEW,
    page: 1,
    pageSize: PAGE_SIZE,
    sort: { reviewCount: SORT_TYPE.ASC, updatedAt: SORT_TYPE.DESC },
  });


  const fetchData = async (searchParams?: TSearchWordParams) => {
    setLoading(true);

    // Filter
    const newFilter = searchParams?.filter || filter;
    const newUseReviewToday = searchParams?.useReviewToday || params.useReviewToday;

    // Pagination
    const FIRST_PAGE = 1;
    const newPage = searchParams?.page || params.page || FIRST_PAGE;
    const newPageSize = (searchParams?.pageSize || params.pageSize) as number;

    // Sort
    const searchParamSort = searchParams?.sort || {};
    const newSort = {...params.sort, ...searchParamSort}; ;
    const stringSort = JSON.stringify(newSort) || '';

    // remove empty fields
    Object.keys(newFilter).forEach((key) => {
      const typedKey = key as keyof TWordSearchForm;

      let value = newFilter[typedKey];

      const isNotValue = !value;
      const isNotValueButValueIs0 = isNotValue && value !== 0;

      if (isNotValue && isNotValueButValueIs0)  delete newFilter[typedKey];
    });

    // New params
    const newParams = {
      page: newPage,
      limit: newPageSize,
      sort: stringSort,
      filter: JSON.stringify({
        ...newFilter,
        topicId,
      }),
      useReviewToday: newUseReviewToday,
      attributes: ATTRIBUTES
    };

    if (newUseReviewToday !== ENABLE_USE_REVIEW) delete newParams.useReviewToday;

    try {
      const response = await getWords(newParams);
      const { list, totalCount } = response.data;
      setReviewWords(list);
      setPagination({ ...pagination, current: newPage, total: totalCount });
    } catch (error) {
      handleErrorResponse(error);
    }

    setLoading(false);
  };


  const handleFetchData = () => {
    fetchData();
  }

  useEffect(() => {
    handleFetchData();
  }, []);


  const openWordModal = (item?: TWordType) => {
    setIsOpenWordModal(true);
    setEditTopicData(item || initialEditWordData);
  };

  const openWordInfoModal = (item?: TWordType) => {
    setIsOpenWordInfoModal(true);
    setEditTopicData(item || initialEditWordData);
  };


  const handleChangeFilter = (newFilter: TWordSearchForm) => {
    fetchData({ filter: newFilter });
    setFilter(newFilter);
  };

  const handleReview = async (wordId: string) => {
    try {
      await markWordAsReviewed(wordId);
      handleSuccessResponse('Word marked as reviewed');
      handleFetchData();
    } catch (error) {
      handleErrorResponse(error);
    }
  }

  const showReviewWordsOrAllWords = (checked: boolean) => {
    if (loading) return;

    const newUseReviewToday = checked ? ENABLE_USE_REVIEW : UN_ENABLE_USE_REVIEW;
    setParams({
      ...params,
      useReviewToday: newUseReviewToday,
    });

    fetchData({useReviewToday: newUseReviewToday});
  }

  const handleTableChange: TableProps<TWordType>['onChange'] = (
    newPagination,
    _,
    sorter
  ) => {
    const newParams: Pick<TSearchWordParams, 'sort' | 'page'> = {}

    // Get sort value
    const { columnKey, order = SORT_TYPE.ASC_TABLE_ANTD } = sorter as {
      columnKey: string;
      order: typeof SORT_TYPE.ASC_TABLE_ANTD | typeof SORT_TYPE.DESC_TABLE_ANTD | undefined;
    };

    const apiOrder =  order === SORT_TYPE.ASC_TABLE_ANTD ? SORT_TYPE.ASC : SORT_TYPE.DESC;
    if (columnKey) newParams.sort =  {
      [columnKey]: apiOrder
    }

    // Get pagination value
    const { current } = newPagination;
    if (current) newParams.page = current;

    fetchData(newParams)
  };

  const countIndexInTable = (index: number) => (pagination.current - 1) * PAGE_SIZE + index + 1;

  const checked = params.useReviewToday === ENABLE_USE_REVIEW;

  const columns: TableProps<TWordType>['columns'] = [
    {
      title: '#',
      key: 'index',
      render: (_, __, index) => countIndexInTable(index),
      width: 50,
    },
    {
      title: 'Sentence',
      dataIndex: 'title',
      key: 'title',
      fixed: 'left',
      width: screens.lg ? '20%' : 180,
      render: (text, item) => {
        const { images } = item;
        const firstImage = images?.[0];
        return (
          <SpeakTextWrapper text={text} className="justify-between speak-text__sentence">
            <Flex align='center' gap="small">
              {firstImage && (
                <img
                  src={firstImage}
                  alt={text}
                  className='object-cover w-12 h-12 flex-shrink-0 rounded-[50%]'
                />
              )}

              <Button
                style={{
                  textWrap: 'wrap',
                  textAlign: 'left',
                  background: 'none',
                  height: 'auto',
                  padding: 0,
                }}
                onClick={() => openWordInfoModal(item)}
                type="text"
              >
                {text}
              </Button>
            </Flex>

          </SpeakTextWrapper>
        )
      },
    },
    {
      title: 'Word',
      dataIndex: 'keyWord',
      key: 'keyWord',
      render: (text) => (
        <SpeakTextWrapper text={text} className="justify-between speak-text__word" />
      ),
    },

    {
      title: 'Pronunciation',
      dataIndex: 'pronounciation',
      key: 'pronounciation',
    },
    {
      title: 'Definition',
      dataIndex: 'definition',
      key: 'definition',
    },
    {
      title: 'Example Count',
      dataIndex: 'examples',
      key: 'examples',
      render: (examples) => examples?.length || 0,
    },
    {
      title: 'Review Count',
      dataIndex: 'reviewCount',
      key: 'reviewCount',
      sorter: true,
    },
    {
      title: 'Last Review Date',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (val) => dayjs(val).format(DATE_FORMAT),
    },
    {
      key: 'action',
      render: (_, record) => (
        <div className="flex items-center gap-1">
          <Tooltip title="Edit">
            <Button
              onClick={() => openWordModal(record)}
              type="text"
              icon={<EditOutlined />}
            />
          </Tooltip>
          <Tooltip title="Review">
            <Button
              onClick={() => handleReview(record._id)}
              type="text"
              icon={<CheckOutlined />}
            />
          </Tooltip>
          <MoreAction />
        </div>
      ),
    },
  ];

  return (
    <>
      <PageContentLayout
        action={
          <Button type="primary" onClick={() => openWordModal()}>
            Add Word
          </Button>
        }
        customHeader={
          <div className="flex flex-col lg:flex-row lg:items-center gap-2">
            <PageContentTitle title={topicData.name} />

            <div className="flex items-center gap-1">
              <Switch onChange={showReviewWordsOrAllWords} checked={checked} />
              <span>{checked ? 'Words to review today' : 'All words'}</span>
            </div>
          </div>
        }
        breadCrumbItems={[
          {
            title: (
              <NavLink href={ROUTE_CONFIG.TOPIC}>
                {REVIEW_TOPICS_BREADCRUMB}
              </NavLink>
            ),
          },
          {
            title: topicData.name,
          },
        ]}
      >
        <div className="mb-5">
          <WordSearch
            searchWordParamsFromParent={params}
            filter={filter}
            onChangeFilter={handleChangeFilter}
          />
        </div>

        <Table<TWordType>
          columns={columns}
          dataSource={reviewWords}
          rowKey="_id"
          loading={loading}
          scroll={{ x: 1000 }}
          onChange={handleTableChange}
          pagination={{
            pageSize: PAGE_SIZE,
            current: pagination.current,
            total: pagination.total,
          }}
        />
      </PageContentLayout>

      <WordModal
        visible={isOpenWordModal}
        onCancel={() => setIsOpenWordModal(false)}
        editData={editTopicData}
        onRefreshData={handleFetchData}
        topicId={topicId}
      />
      <WordInfoModal
        visible={isOpenWordInfoModal}
        onCancel={() => setIsOpenWordInfoModal(false)}
        editData={editTopicData}
      />
    </>
  );
};

export default Review;
