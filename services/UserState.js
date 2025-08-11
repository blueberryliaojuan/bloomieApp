// userState.js
import { hookstate, useHookstate } from "@hookstate/core";

const userState = hookstate({ user: null });

export function useUserState() {
  const state = useHookstate(userState);

  return {
    user: state.user.get(),
    setUser: (cUser) => state.user.set(cUser),
    clearUser: () => state.user.set(null),
  };
}
