import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Post } from 'types/blog.type'
import { CustomError } from 'utils/helpers'

export const blogApi = createApi({
  reducerPath: 'blogApi',
  tagTypes: ['Posts'],
  keepUnusedDataFor: 5,
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://jvmtn4-8080.csb.app/',
    prepareHeaders(headers) {
      headers.set('authorization', 'Bearer ABCXYZ')
      return headers
    }
  }),
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => 'posts',

      providesTags: (result) => {
        if (result) {
          const final = [
            ...result.map(({ id }) => ({ type: 'Posts' as const, id })),
            { type: 'Posts' as const, id: 'LIST' }
          ]
          return final
        }
        const final = [{ type: 'Posts' as const, id: 'LIST' }]
        return final
      }
    }),

    addPost: builder.mutation<Post, Omit<Post, 'id'>>({
      query: (body) => {
        try {
          return {
            url: 'posts',
            method: 'POST',
            body
          }
        } catch (error: any) {
          throw new CustomError(error.message)
        }
      },
      invalidatesTags: (result, error, body) =>
        error
          ? []
          : [
              {
                type: 'Posts',
                id: 'LIST'
              }
            ]
    }),

    getPost: builder.query<Post, string>({
      query: (id) => ({
        url: `posts/${id}`,
        headers: {
          hello: "I'm leader"
        },
        params: {
          first_name: 'Vũ',
          'last-name': 'Đức'
        }
      })
    }),

    updatePost: builder.mutation<Post, { id: string; body: Post }>({
      query: (data) => {
        return {
          url: `posts/${data.id}`,
          method: 'PUT',
          body: data.body
        }
      },
      invalidatesTags: (result, error, data) =>
        error
          ? []
          : [
              {
                type: 'Posts',
                id: data.id
              }
            ]
    }),

    deletePost: builder.mutation<{}, string>({
      query: (id) => {
        return {
          url: `posts/${id}`,
          method: 'DELETE'
        }
      },
      invalidatesTags: (result, error, id) => [
        {
          type: 'Posts',
          id
        }
      ]
    })
  })
})

export const { useGetPostsQuery, useAddPostMutation, useGetPostQuery, useUpdatePostMutation, useDeletePostMutation } =
  blogApi
