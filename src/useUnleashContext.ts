import type { IContext } from 'unleash-proxy-client';
import { inject, type Ref } from 'vue';
import { ContextStateSymbol } from './context';

type TUnleashContext = Partial<{
  updateContext: Ref<(context: IContext) => Promise<void>>;
}>;

const useUnleashContext = () => {
  const { updateContext } = inject<TUnleashContext>(ContextStateSymbol, {});
  return updateContext?.value;
};

export default useUnleashContext;
