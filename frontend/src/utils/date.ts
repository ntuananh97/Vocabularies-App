import { DATE_FORMAT } from "@/configs/constants";
import dayjs, { Dayjs } from "dayjs";

export const formatDate = (date: string | Dayjs) => dayjs(date).format(DATE_FORMAT);
