type NaoFornecido = undefined | null;

// Tipo utilitário que resolve os argumentos solicitados pela nova função
type ResolverArgumentosFaltantes<TArgs extends any[], TFixos extends any[]> = 
  TFixos extends [infer HeadFixo, ...infer TailFixos]
    ? TArgs extends [infer HeadArg, ...infer TailArgs]
      // 1. Se for undefined/null, OBRIGA o argumento original
      ? HeadFixo extends NaoFornecido
        ? [HeadArg, ...ResolverArgumentosFaltantes<TailArgs, TailFixos>]
      // 2. Se for uma função manipuladora (Transformador): OBRIGA o argumento original (para ser transformado)
      : HeadFixo extends (val: HeadArg) => any
        ? [HeadArg, ...ResolverArgumentosFaltantes<TailArgs, TailFixos>]
      // 3. Se for um valor estático já fixado: OMITA da assinatura final
        : ResolverArgumentosFaltantes<TailArgs, TailFixos>
      : []
    : TArgs;


export function Fix<TArgs extends any[], TRetorno, TFixos extends any[]>(
  fn: (...args: TArgs) => TRetorno,
  ...fixos: TFixos
) {
  return (...novosArgs: ResolverArgumentosFaltantes<TArgs, TFixos>): TRetorno => {
    let i = 0;

    const argsFinais = fixos.map((fixo) => {
      // Caso 1: Lacuna (undefined ou null) -> usa o argumento recebido diretamente
      if (fixo === undefined || fixo === null) {
        const valor = novosArgs[i];
        i++;
        return valor;
      }

      // Caso 2: Função Manipuladora -> passa o argumento recebido para a função e usa o retorno
      if (typeof fixo === "function") {
        const valorOriginal = novosArgs[i];
        i++;
        return fixo(valorOriginal);
      }

      // Caso 3: Valor estático pré-fixado
      return fixo;
    });

    const argsCompletos = [...argsFinais, ...novosArgs.slice(i)];
    return fn(...(argsCompletos as TArgs));
  };
}