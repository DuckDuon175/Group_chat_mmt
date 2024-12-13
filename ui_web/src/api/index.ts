import * as ApiClientFactory from "./api-generated";

export * from "./api-generated";

const api_url: string = "http://localhost:3000";

const Context = JSON.parse(localStorage.getItem("ui-context") || "{}");

const userId = Context.id;
console.log(userId)

const authorizedFetchFunction = (
  url: RequestInfo,
  init: RequestInit
): Promise<Response> => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${userId}`,
  };
  init = init || {};
  init.headers = Object.assign({}, init.headers, headers);
  return fetch(url, init);
};
const userClient = new ApiClientFactory.UserControllerClient(api_url, {
  fetch: authorizedFetchFunction,
});

const chatClient = new ApiClientFactory.ChatControllerClient(api_url, {
  fetch: authorizedFetchFunction,
});

interface IService {
  userService: ApiClientFactory.UserControllerClient;
  chatService: ApiClientFactory.ChatControllerClient;
}

export const Service: IService = {
  userService: userClient,
  chatService: chatClient,
};
