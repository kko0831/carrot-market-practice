import type { NextPage } from "next";
import Layout from "@components/Layout";
import useUser from "@libs/client/useUser";
import useSWR from "swr";
import { useRouter } from "next/router";
import Button from "@components/Button";
import { Product, Review, User } from "@prisma/client";
import { cls } from "@libs/utils";
import Link from "next/link";
import ImgComponent from "@components/ImgComponent";
import useMutation from "@libs/client/useMutation";
import { useEffect } from "react";
import gravatar from "gravatar";

interface ProductScore extends Product {
  productReviews: Review[];
}

interface ProfileWithReview extends User {
  sales: [
    {
      product: ProductScore;
    }
  ];
}

interface ProfileResponse {
  ok: boolean;
  other: ProfileWithReview;
}

const ReviewForSellerDetail: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();

  const { data } = useSWR<ProfileResponse>(
    router.query.id ? `/api/users/other/${router.query.id}` : null
    // other 상대방
  );

  // console.log("Profile---data: ", JSON.stringify(data, null, 2));

  const salesWithReview = data?.other?.sales?.filter(
    (sale) => sale?.product?.productReviews?.length > 0
  );

  const [
    talkToSeller,
    { loading: talkToSellerLoading, data: talkToSellerData },
  ] = useMutation(`/api/chat`);

  useEffect(() => {
    if (talkToSellerData && talkToSellerData.ok) {
      talkToSellerData.chatRoomList
        ? router.push(`/chats/${talkToSellerData.chatRoomList.id}`)
        : router.push(`/chats/${talkToSellerData.createChat.id}`);
    }
  }, [router, talkToSellerData]);

  if (!router.query.id) {
    console.log("Logical error: router.query.id should be given but not.");
    return null;
  }

  //   const onChatClick = () => {
  //     console.log("onChatClick clicked.");
  //     if (talkToSellerLoading) return;
  //     talkToSeller({ buyerId: user?.id, sellerId: +router.query.id! });
  //   };

  return (
    <Layout
      seoTitle={`${data?.other.name}의 Review`}
      title={`${data?.other.name}의 받은 후기(Received Reviews)`}
      canGoBack
      backUrl="back"
      isProfile={true}
    >
      <div className="px-4 py-4 space-y-4">
        <div className="flex items-center pb-4 mt-4 space-x-3 border-b">
          {data?.other?.avatar ? (
            <ImgComponent
              width={48}
              height={48}
              clsProps="rounded-full bg-gray-400"
              imgAdd={`https://imagedelivery.net/${process.env.NEXT_PUBLIC_CF_HASH}/${data?.other.avatar}/public`}
              imgName={data?.other.name}
            />
          ) : (
            <ImgComponent
              imgAdd={`https:${gravatar.url(
                data?.other?.email ? data?.other?.email : "anonymous@email.com",
                {
                  s: "48px",
                  d: "retro",
                }
              )}`}
              width={48}
              height={48}
              clsProps="rounded-full"
              imgName={"UserAvatar"}
            />
          )}
          <div className="flex flex-col">
          <div className="text-xs">판매자</div>
            <span className="font-medium text-gray-900">
              {data?.other?.name || "판매자 이름"}
            </span>
          </div>
        </div>
        {/* <div className="pt-3 text-lg font-bold">
          받은 후기(Received Reviews)
        </div> */}
        {salesWithReview?.map((sale, idx) => (
          <Link key={idx} href={`/products/${sale?.product?.id}`}>
            <a className="flex flex-col pb-2 mb-2 border-b cursor-pointer">
              <div className="flex items-center space-x-4">
                <ImgComponent
                  width={60}
                  height={60}
                  clsProps="rounded-md bg-gray-400"
                  imgAdd={`https://imagedelivery.net/${process.env.NEXT_PUBLIC_CF_HASH}/${sale?.product?.image}/public`}
                />
                <div className="pt-2">
                  <h3 className="text-sm font-medium text-gray-900">
                    {`${sale?.product?.name}`}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {/* 여기에 flex와 space-x-2를 추가하여 요소들 사이에 적당한 간격을 줍니다. */}
                    <span className="flex items-center font-medium text-gray-900">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={cls(
                            "h-5 w-5",
                            sale?.product?.productReviews[0]?.score >= star
                              ? "text-yellow-400"
                              : "text-gray-300"
                          )}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </span>
                    <span className="font-normal">
                      {sale?.product?.productReviews[0]?.score
                        ? `(${sale.product.productReviews[0].score})`
                        : ""}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {sale?.product?.productReviews[0]?.review || "리뷰가 없습니다."}
              </div>
              <div className="mt-1 text-sm font-normal text-gray-800">
                {sale?.product?.productReviews[0]?.updatedAt
                  ? new Date(
                      sale.product.productReviews[0].updatedAt
                    ).toISOString()
                  : "날짜 정보 없음"}
              </div>
            </a>
          </Link>
        ))}
      </div>
    </Layout>
  );
};
export default ReviewForSellerDetail;
