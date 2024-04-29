import * as U from './unions'
import * as User from './user'
import * as Story from './story';
import * as Short from './short';
import * as Publication from './publication'
import * as Message from './message';
import * as Live from './live'
import * as Group from './group';
import * as Comment from './comment';
import * as Notification from './notification'
import * as Friend from './friend'

export {U, User, Live, Group, Story, Short, Friend, Message, Comment, Publication, Notification};

declare global {
	namespace Express {
		interface Request {
			user: User.Payload
			cookies: {
				[key: string]: string
			}
		}
	}
}
