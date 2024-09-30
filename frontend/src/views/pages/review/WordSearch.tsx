import { Button, Col, DatePicker, Drawer, Input, InputNumber, InputNumberProps, Row } from 'antd';
import React, { useId, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { TWordSearchForm } from '@/types/word';
import SearchComponent from './SearchComponent';
import PeriodSelect from '@/components/Selects/PeriodSelect';
import LessonSelect from '@/components/Selects/LessonSelect';
import { SEARCH_WORD_FIELDS } from '@/configs/words';
import dayjs, { Dayjs } from 'dayjs';

interface IWordSearchProps {
  onChangeFilter: (_filter: TWordSearchForm) => void;
  filter: TWordSearchForm;
}

const { RangePicker } = DatePicker;

const WordSearch: React.FC<IWordSearchProps> = ({ filter, onChangeFilter }) => {
  const [open, setOpen] = useState(false);
  const unique = useId();

  const { keyWord, definition, lessonId, step } = filter;

  const getUniqueId = (key: string) => `${key}-${unique}`;

  const handleChangeFilter = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const changeValue = { ...filter, [key]: e.target.value };
    onChangeFilter(changeValue);
  };

  const handleChangeRiewCount: InputNumberProps['onChange'] = (val) => {
    const valWithType = val as TWordSearchForm['reviewCount']
    const changeValue = { ...filter, reviewCount: valWithType };
    onChangeFilter(changeValue);
  }

  const handleChangeSelect = (val: string, key: string) => {
    const changeValue = { ...filter, [key]: val };
    onChangeFilter(changeValue);
  }

  const handleChangeRangePicker = (dates: null | (Dayjs | null)[], key: string) => {
    let dateData = dates?.[0] ? dayjs(dates?.[0]).startOf('day').toISOString() : "";

    if (dates?.[1]) {
      dateData += `,${dayjs(dates?.[1]).endOf('day').toISOString()}`;
    }
    const changeValue = { ...filter, [key]: dateData };
    onChangeFilter(changeValue);
  }

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Row gutter={15}>
        <Col span={7}>
          <Input
            onChange={(e) => handleChangeFilter(e, SEARCH_WORD_FIELDS.KEY_WORD)}
            placeholder="Seach word"
            value={keyWord}
          />
        </Col>
        <Col span={7}>
          <Input
            onChange={(e) => handleChangeFilter(e, SEARCH_WORD_FIELDS.DEFINITION)}
            placeholder="Search definition"
            value={definition}
          />
        </Col>
        <Col span={7}>
          <RangePicker
            className="w-full"
            placeholder={['Start date', 'End Date']}
            onChange={(value) => handleChangeRangePicker(value, SEARCH_WORD_FIELDS.CREATED_AT)}
          />
        </Col>
        <Col span={3}>
          <Button
            onClick={showDrawer}
            type="primary"
            className="w-full"
            icon={<PlusOutlined />}
          >
            Other
          </Button>
        </Col>
      </Row>
      <Drawer title="Basic Drawer" onClose={onClose} open={open}>
        <SearchComponent label="Số lần review" labelFor={getUniqueId('word-review-count-search-id')}>
          <InputNumber<number>
            id={getUniqueId('word-review-count-search-id')}
            onChange={handleChangeRiewCount}
            className="w-full"
            style={{ width: '100%' }}
            // reviewCount
          />
        </SearchComponent>
        <SearchComponent label="Câu" labelFor={getUniqueId('word-sentence-search-id')}>
          <Input
            id={getUniqueId('word-sentence-search-id')}
            onChange={(e) => handleChangeFilter(e, SEARCH_WORD_FIELDS.TITLE)}
            className="w-full"
          />
        </SearchComponent>
        <SearchComponent label="Mốc thời gian" labelFor={getUniqueId('word-period-search-id')}>
          <PeriodSelect
            id={getUniqueId('word-period-search-id')}
            className="w-full"
            value={step?.toString() || ''}
            onChange={(value) =>handleChangeSelect(value, SEARCH_WORD_FIELDS.STEP)}
            allowClear
          />
        </SearchComponent>
        <SearchComponent label="Nhóm từ" labelFor={getUniqueId('word-sentence-search-id')}>
        <LessonSelect
            id={getUniqueId('word-lesson-search-id')}
            className="w-full"
            value={lessonId}
            onChange={(value) =>handleChangeSelect(value, SEARCH_WORD_FIELDS.LESSON_ID)}
            allowClear
          />
        </SearchComponent>
      </Drawer>
    </>
  );
};

export default React.memo(WordSearch);
