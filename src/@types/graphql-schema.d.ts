export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** DateTime */
  DateTime: any;
  /** Raw JSON value */
  Json: any;
  /** The `Long` scalar type represents non-fractional signed whole numeric values. Long can represent values between -(2^63) and 2^63 - 1. */
  Long: any;
};

export type Home = _Document &
  _Linkable & {
    __typename?: "Home";
    introduction?: Maybe<Scalars["Json"]>;
    hero_title?: Maybe<Scalars["String"]>;
    body?: Maybe<Array<HomeBody>>;
    meta_title?: Maybe<Scalars["String"]>;
    meta_description?: Maybe<Scalars["String"]>;
    _meta: Meta;
    _linkType?: Maybe<Scalars["String"]>;
  };

export type HomeBody = HomeBodyText;

export type HomeBodyText = {
  __typename?: "HomeBodyText";
  type?: Maybe<Scalars["String"]>;
  label?: Maybe<Scalars["String"]>;
  primary?: Maybe<HomeBodyTextPrimary>;
};

export type HomeBodyTextPrimary = {
  __typename?: "HomeBodyTextPrimary";
  text?: Maybe<Scalars["Json"]>;
};

/** A connection to a list of items. */
export type HomeConnectionConnection = {
  __typename?: "HomeConnectionConnection";
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<HomeConnectionEdge>>>;
  totalCount: Scalars["Long"];
};

/** An edge in a connection. */
export type HomeConnectionEdge = {
  __typename?: "HomeConnectionEdge";
  /** The item at the end of the edge. */
  node: Home;
  /** A cursor for use in pagination. */
  cursor: Scalars["String"];
};

export type Meta = {
  __typename?: "Meta";
  /** The id of the document. */
  id: Scalars["String"];
  /** The uid of the document. */
  uid?: Maybe<Scalars["String"]>;
  /** The type of the document. */
  type: Scalars["String"];
  /** The tags of the document. */
  tags: Array<Scalars["String"]>;
  /** The language of the document. */
  lang: Scalars["String"];
  /** Alternate languages the document. */
  alternateLanguages: Array<RelatedDocument>;
  /** The first publication date of the document. */
  firstPublicationDate?: Maybe<Scalars["DateTime"]>;
  /** The last publication date of the document. */
  lastPublicationDate?: Maybe<Scalars["DateTime"]>;
};

export type Page = _Document &
  _Linkable & {
    __typename?: "Page";
    title?: Maybe<Scalars["Json"]>;
    subtitle?: Maybe<Scalars["Json"]>;
    body?: Maybe<Array<PageBody>>;
    _meta: Meta;
    _linkType?: Maybe<Scalars["String"]>;
  };

export type PageBody = PageBodyContent;

export type PageBodyContent = {
  __typename?: "PageBodyContent";
  type?: Maybe<Scalars["String"]>;
  label?: Maybe<Scalars["String"]>;
  primary?: Maybe<PageBodyContentPrimary>;
};

export type PageBodyContentPrimary = {
  __typename?: "PageBodyContentPrimary";
  text?: Maybe<Scalars["Json"]>;
};

/** A connection to a list of items. */
export type PageConnectionConnection = {
  __typename?: "PageConnectionConnection";
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<PageConnectionEdge>>>;
  totalCount: Scalars["Long"];
};

/** An edge in a connection. */
export type PageConnectionEdge = {
  __typename?: "PageConnectionEdge";
  /** The item at the end of the edge. */
  node: Page;
  /** A cursor for use in pagination. */
  cursor: Scalars["String"];
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: "PageInfo";
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars["Boolean"];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars["Boolean"];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars["String"]>;
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars["String"]>;
};

export type Query = {
  __typename?: "Query";
  _allDocuments: _DocumentConnection;
  page?: Maybe<Page>;
  allPages: PageConnectionConnection;
  home?: Maybe<Home>;
  allHomes: HomeConnectionConnection;
};

export type Query_AllDocumentsArgs = {
  sortBy?: Maybe<SortDocumentsBy>;
  id?: Maybe<Scalars["String"]>;
  id_in?: Maybe<Array<Scalars["String"]>>;
  uid?: Maybe<Scalars["String"]>;
  uid_in?: Maybe<Array<Scalars["String"]>>;
  lang?: Maybe<Scalars["String"]>;
  tags?: Maybe<Array<Scalars["String"]>>;
  tags_in?: Maybe<Array<Scalars["String"]>>;
  type?: Maybe<Scalars["String"]>;
  type_in?: Maybe<Array<Scalars["String"]>>;
  firstPublicationDate?: Maybe<Scalars["DateTime"]>;
  firstPublicationDate_after?: Maybe<Scalars["DateTime"]>;
  firstPublicationDate_before?: Maybe<Scalars["DateTime"]>;
  lastPublicationDate?: Maybe<Scalars["DateTime"]>;
  lastPublicationDate_after?: Maybe<Scalars["DateTime"]>;
  lastPublicationDate_before?: Maybe<Scalars["DateTime"]>;
  fulltext?: Maybe<Scalars["String"]>;
  similar?: Maybe<Similar>;
  before?: Maybe<Scalars["String"]>;
  after?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
};

export type QueryPageArgs = {
  uid: Scalars["String"];
  lang: Scalars["String"];
};

export type QueryAllPagesArgs = {
  sortBy?: Maybe<SortPagey>;
  id?: Maybe<Scalars["String"]>;
  id_in?: Maybe<Array<Scalars["String"]>>;
  uid?: Maybe<Scalars["String"]>;
  uid_in?: Maybe<Array<Scalars["String"]>>;
  lang?: Maybe<Scalars["String"]>;
  tags?: Maybe<Array<Scalars["String"]>>;
  tags_in?: Maybe<Array<Scalars["String"]>>;
  type?: Maybe<Scalars["String"]>;
  type_in?: Maybe<Array<Scalars["String"]>>;
  firstPublicationDate?: Maybe<Scalars["DateTime"]>;
  firstPublicationDate_after?: Maybe<Scalars["DateTime"]>;
  firstPublicationDate_before?: Maybe<Scalars["DateTime"]>;
  lastPublicationDate?: Maybe<Scalars["DateTime"]>;
  lastPublicationDate_after?: Maybe<Scalars["DateTime"]>;
  lastPublicationDate_before?: Maybe<Scalars["DateTime"]>;
  fulltext?: Maybe<Scalars["String"]>;
  similar?: Maybe<Similar>;
  where?: Maybe<WherePage>;
  before?: Maybe<Scalars["String"]>;
  after?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
};

export type QueryHomeArgs = {
  uid: Scalars["String"];
  lang: Scalars["String"];
};

export type QueryAllHomesArgs = {
  sortBy?: Maybe<SortHomey>;
  id?: Maybe<Scalars["String"]>;
  id_in?: Maybe<Array<Scalars["String"]>>;
  uid?: Maybe<Scalars["String"]>;
  uid_in?: Maybe<Array<Scalars["String"]>>;
  lang?: Maybe<Scalars["String"]>;
  tags?: Maybe<Array<Scalars["String"]>>;
  tags_in?: Maybe<Array<Scalars["String"]>>;
  type?: Maybe<Scalars["String"]>;
  type_in?: Maybe<Array<Scalars["String"]>>;
  firstPublicationDate?: Maybe<Scalars["DateTime"]>;
  firstPublicationDate_after?: Maybe<Scalars["DateTime"]>;
  firstPublicationDate_before?: Maybe<Scalars["DateTime"]>;
  lastPublicationDate?: Maybe<Scalars["DateTime"]>;
  lastPublicationDate_after?: Maybe<Scalars["DateTime"]>;
  lastPublicationDate_before?: Maybe<Scalars["DateTime"]>;
  fulltext?: Maybe<Scalars["String"]>;
  similar?: Maybe<Similar>;
  where?: Maybe<WhereHome>;
  before?: Maybe<Scalars["String"]>;
  after?: Maybe<Scalars["String"]>;
  first?: Maybe<Scalars["Int"]>;
  last?: Maybe<Scalars["Int"]>;
};

export type RelatedDocument = {
  __typename?: "RelatedDocument";
  /** The id of the document. */
  id: Scalars["String"];
  /** The uid of the document. */
  uid?: Maybe<Scalars["String"]>;
  /** The type of the document. */
  type: Scalars["String"];
  /** The language of the document. */
  lang: Scalars["String"];
};

export enum SortDocumentsBy {
  MetaFirstPublicationDateAsc = "meta_firstPublicationDate_ASC",
  MetaFirstPublicationDateDesc = "meta_firstPublicationDate_DESC",
  MetaLastPublicationDateAsc = "meta_lastPublicationDate_ASC",
  MetaLastPublicationDateDesc = "meta_lastPublicationDate_DESC",
}

export enum SortHomey {
  MetaFirstPublicationDateAsc = "meta_firstPublicationDate_ASC",
  MetaFirstPublicationDateDesc = "meta_firstPublicationDate_DESC",
  MetaLastPublicationDateAsc = "meta_lastPublicationDate_ASC",
  MetaLastPublicationDateDesc = "meta_lastPublicationDate_DESC",
  IntroductionAsc = "introduction_ASC",
  IntroductionDesc = "introduction_DESC",
  HeroTitleAsc = "hero_title_ASC",
  HeroTitleDesc = "hero_title_DESC",
  MetaTitleAsc = "meta_title_ASC",
  MetaTitleDesc = "meta_title_DESC",
  MetaDescriptionAsc = "meta_description_ASC",
  MetaDescriptionDesc = "meta_description_DESC",
}

export enum SortPagey {
  MetaFirstPublicationDateAsc = "meta_firstPublicationDate_ASC",
  MetaFirstPublicationDateDesc = "meta_firstPublicationDate_DESC",
  MetaLastPublicationDateAsc = "meta_lastPublicationDate_ASC",
  MetaLastPublicationDateDesc = "meta_lastPublicationDate_DESC",
  TitleAsc = "title_ASC",
  TitleDesc = "title_DESC",
  SubtitleAsc = "subtitle_ASC",
  SubtitleDesc = "subtitle_DESC",
}

export type WhereHome = {
  /** introduction */
  introduction_fulltext?: Maybe<Scalars["String"]>;
  hero_title?: Maybe<Scalars["String"]>;
  hero_title_fulltext?: Maybe<Scalars["String"]>;
  meta_title?: Maybe<Scalars["String"]>;
  meta_title_fulltext?: Maybe<Scalars["String"]>;
  meta_description?: Maybe<Scalars["String"]>;
  meta_description_fulltext?: Maybe<Scalars["String"]>;
};

export type WherePage = {
  /** title */
  title_fulltext?: Maybe<Scalars["String"]>;
  /** subtitle */
  subtitle_fulltext?: Maybe<Scalars["String"]>;
};

/** A prismic document */
export type _Document = {
  _meta: Meta;
};

/** A connection to a list of items. */
export type _DocumentConnection = {
  __typename?: "_DocumentConnection";
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<_DocumentEdge>>>;
  totalCount: Scalars["Long"];
};

/** An edge in a connection. */
export type _DocumentEdge = {
  __typename?: "_DocumentEdge";
  /** The item at the end of the edge. */
  node: _Document;
  /** A cursor for use in pagination. */
  cursor: Scalars["String"];
};

/** An external link */
export type _ExternalLink = _Linkable & {
  __typename?: "_ExternalLink";
  url: Scalars["String"];
  _linkType?: Maybe<Scalars["String"]>;
};

/** A linked file */
export type _FileLink = _Linkable & {
  __typename?: "_FileLink";
  name: Scalars["String"];
  url: Scalars["String"];
  size: Scalars["Long"];
  _linkType?: Maybe<Scalars["String"]>;
};

/** A linked image */
export type _ImageLink = _Linkable & {
  __typename?: "_ImageLink";
  name: Scalars["String"];
  url: Scalars["String"];
  size: Scalars["Long"];
  height: Scalars["Int"];
  width: Scalars["Int"];
  _linkType?: Maybe<Scalars["String"]>;
};

/** A prismic link */
export type _Linkable = {
  _linkType?: Maybe<Scalars["String"]>;
};

export type Similar = {
  documentId: Scalars["String"];
  max: Scalars["Int"];
};
