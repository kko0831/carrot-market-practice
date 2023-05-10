import Button from "@components/Button";
import Layout from "@components/Layout";
import fetcher from "@libs/client/fetcher";
import { Product, User } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Backdrop, CircularProgress } from "@mui/material";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/utils";
import BackdropSpinner from "@components/DropSpinner";

interface ProductWithUser extends Product {
  user: User;
}

interface ItemDetailResponse {
  ok: boolean;
  isLiked: boolean;
  product: ProductWithUser;
  relatedProducts: ProductWithUser[];
}

interface BaseMutation {
  ok: boolean;
}

const ItemDetail: NextPage = () => {
  const router = useRouter();
  console.log("router.query: ", router.query);
  const {
    data,
    error,
    mutate: mutateProduct,
  } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null,
    fetcher
    // { dedupingInterval: 10000 }
  );
  console.log("ItemDetail data: ", data);

  const [toggleFav] = useMutation<BaseMutation>(`/api/products/${router.query.id as String}/fav`);
  const onFavClick = () => {
    mutateProduct(
      (prev) => {
        return prev && { ...prev, isLiked: !prev.isLiked };
      },
      false // { revalidate: true }
    );
    // mutate는 2가지 인수를 받는데, 바꿀 객체의 값과, default의 값이 true인 revalidate를 받게 됩니다.
    // 여기서 revalidate는 바꾸고 다시 api endpoint로 검증을 시켜서 한번더 get요청을 보내서 업데이트 하는 과정을 말합니다.

    toggleFav({});
  };
  return (
    <Layout canGoBack>
      <BackdropSpinner open={data === undefined} />
      {/* <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={data === undefined}
      >
        <CircularProgress color="inherit" />
      </Backdrop> */}
      <div className="px-4 py-3">
        <div className="mb-8">
          <div className="h-96 bg-slate-300" />
          <div className="space-x-300 mt-1 flex items-center border-b border-t">
            <div className="h-12 w-12 rounded-full bg-slate-300" />
            <div>
              <p className="text-sm font-medium text-gray-700">{data?.product.user.name}</p>
              <p className="cursor-pointer text-xs font-medium text-gray-500">
                View profile &rarr;
              </p>
            </div>
          </div>
          <div className="mt-5">
            <h1 className="text-3xl font-bold text-gray-900">{data?.product.name}</h1>
            <span className="mt-3 block text-3xl text-gray-900">${data?.product.price}</span>
            <p className="my-6 text-base text-gray-700">{data?.product.description}</p>
            <div className="flex items-center justify-between space-x-2">
              <Button text="Talk to seller" large />
              <button
                onClick={onFavClick}
                className={cls(
                  "flex items-center justify-center rounded-md p-3 hover:bg-gray-100 ",
                  data?.isLiked
                    ? " text-red-400  hover:text-red-500 "
                    : " text-gray-400  hover:text-gray-500"
                )}
              >
                {data?.isLiked ? (
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    stroke="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 "
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {data?.relatedProducts.map(({ id, name, price }) => (
              <div key={id}>
                <div className="mb-4 h-56 w-full bg-slate-300" />
                <h3 className="-mb-1 text-gray-700 ">{name}</h3>
                <span className="text-sm font-medium text-gray-900">${price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ItemDetail;
