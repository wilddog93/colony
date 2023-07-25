import { TimelineItemBase } from "react-calendar-timeline";

export type Maybe<T> = T | null | undefined;

export interface CustomTimelineItem extends TimelineItemBase<number> {
  taskType?: Maybe<string>;
}
