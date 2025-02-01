export type Event = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  categoryId?: string;
  reminders: number[];
  description?: string;
};

export type Category = {
  id: string;
  name: string;
  color: string;
};
