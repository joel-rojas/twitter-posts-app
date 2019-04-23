import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { TwitterPosts, TwitterPostsModel } from './twitter.model';
import { TwitterActions, TwitterActionTypes } from './twitter.actions';

export interface TwitterState extends EntityState<TwitterPosts> {
  // additional entities state properties
  users: {id: number; user: string; posts: TwitterPosts[]}[];
}

export const emptyTwitterPosts: TwitterState = {
  ids: [],
  entities: null,
  users: []
};

export const adapter: EntityAdapter<TwitterPosts> = createEntityAdapter<TwitterPosts>();

export const initialState: TwitterState = adapter.getInitialState(emptyTwitterPosts);

export function reducer(
  state = initialState,
  action: TwitterActions
): TwitterState {
  switch (action.type) {
    case TwitterActionTypes.AddTwitter: {
      return adapter.addOne(action.payload.twitterPost, state);
    }

    case TwitterActionTypes.UpsertTwitter: {
      return adapter.upsertOne(action.payload.twitterPost, state);
    }

    case TwitterActionTypes.AddTwitters: {
      return adapter.addMany(action.payload.twitterPosts, state);
    }

    case TwitterActionTypes.UpsertTwitters: {
      return adapter.upsertMany(action.payload.twitterPosts, state);
    }

    case TwitterActionTypes.UpdateTwitter: {
      return adapter.updateOne(action.payload.twitter, state);
    }

    case TwitterActionTypes.UpdateTwitters: {
      return adapter.updateMany(action.payload.twitterPosts, state);
    }

    case TwitterActionTypes.DeleteTwitter: {
      return adapter.removeOne(action.payload.id, state);
    }

    case TwitterActionTypes.DeleteTwitters: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case TwitterActionTypes.TwitterPostsLoaded: {
      const twitterPostsModel = new TwitterPostsModel();
      const {twitterPosts} = action.payload;
      const filteredByUser = twitterPostsModel.filterTwitterPostsByUser(twitterPosts);
      const users = Object.keys(filteredByUser).map((key, idx) => ({id: idx, user: key, posts: filteredByUser[key]}));
      return Object.assign({}, adapter.addAll(twitterPosts, state), {users});
    }

    case TwitterActionTypes.ClearTwitters: {
      return adapter.removeAll(state);
    }

    default: {
      return state;
    }
  }
}


export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
