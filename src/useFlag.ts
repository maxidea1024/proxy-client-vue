import type { UnleashClient } from 'unleash-proxy-client';
import { ref, inject, onUnmounted, type Ref } from 'vue';
import { ContextStateSymbol } from './context';

type TFlagContext = Partial<{
  isEnabled: Ref<(name: string) => boolean | undefined>;
  client: Ref<UnleashClient>;
}>;

const useFlag = (name: string) => {
  const { isEnabled, client } = inject<TFlagContext>(ContextStateSymbol, {});
  const flag = ref(Boolean(isEnabled?.value(name)));

  const readyHandler = () => {
    flag.value = Boolean(isEnabled?.value(name));
  }

  const updateHandler = () => {
    const enabled = isEnabled?.value(name);
    if (enabled !== flag.value) {
      flag.value = !!enabled;
    }
  }

  client?.value.on('ready', readyHandler);
  client?.value.on('update', updateHandler);

  onUnmounted(() => {
    client?.value.off('ready', readyHandler);
    client?.value.off('update', updateHandler);
  });

  return flag;
};

export default useFlag;
