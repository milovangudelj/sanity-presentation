import { groq } from "next-sanity";

export const POSTS_QUERY = groq`*[_type == "post" && defined(slug)] | order(publishedAt asc){
  _id,
  title,
  "category": categories[0]->title,
  "author": author->{
    _id,
    firstName,
    lastName,
    role,
    "image": image{
      alt,
      asset->
    }
  }
}`;

export const POST_SLUGS_QUERY = groq`*[_type == "post" && defined(slug)].slug.current`;

export const POST_QUERY = groq`*[_type == "post" && slug.current == $slug][0]`;
