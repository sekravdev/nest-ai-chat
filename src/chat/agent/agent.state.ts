import { Annotation } from '@langchain/langgraph';

export const State = Annotation.Root({
  input: Annotation<string>(),
  intent: Annotation<string>(),
  response: Annotation<string>(),
  steps: Annotation<{ step: string; result: string }[]>({
    value: (prev, next) => [...prev, ...next],
    default: () => [],
  }),
});

export type ChatState = typeof State.State;
