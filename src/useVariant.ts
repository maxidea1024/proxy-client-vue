import type { IVariant, UnleashClient } from 'unleash-proxy-client';
import { ref, inject, onUnmounted, type Ref } from 'vue';
import { ContextStateSymbol } from './context';

type TVariantContext = Partial<{
  getVariant: Ref<(name: string) => IVariant | undefined>;
  client: Ref<UnleashClient>;
}>;

const variantHasChanged = (
  oldVariant?: IVariant,
  newVariant?: IVariant,
): boolean => {
  const variantsAreEqual =
    oldVariant?.name === newVariant?.name &&
    oldVariant?.enabled === newVariant?.enabled &&
    oldVariant?.feature_enabled === newVariant?.feature_enabled &&
    oldVariant?.payload?.type === newVariant?.payload?.type &&
    oldVariant?.payload?.value === newVariant?.payload?.value;

  return !variantsAreEqual;
};

const useVariant = (name: string) => {
  const { getVariant, client } = inject<TVariantContext>(
    ContextStateSymbol,
    {},
  );
  const variant = ref(getVariant?.value(name));

  function updateHandler() {
    const newVariant = getVariant?.value(name);
    if (variantHasChanged(variant?.value, newVariant)) {
      variant.value = newVariant;
    }
  }

  function readyHandler() {
    variant.value = getVariant?.value(name);
  }

  client?.value.on('ready', readyHandler);
  client?.value.on('update', updateHandler);

  onUnmounted(() => {
    client?.value.off('ready', readyHandler);
    client?.value.off('update', updateHandler);
  });

  return variant || {};
};

export default useVariant;
