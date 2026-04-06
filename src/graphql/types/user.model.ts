import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLISODateTime } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ObjectType({ description: 'Registered platform user' })
export class UserGql {
  @Field(() => ID, { description: 'Unique user identifier (UUID)' })
  id!: string;

  @Field({ description: 'Email address (unique)' })
  email!: string;

  @Field({ description: 'Given name' })
  firstName!: string;

  @Field({ description: 'Family name' })
  lastName!: string;

  @Field({ description: 'Telegram profile URL' })
  telegramUrl!: string;

  @Field(() => GraphQLISODateTime, { description: 'Record creation time' })
  createdAt!: Date;

  @Field(() => GraphQLISODateTime, { description: 'Last update time' })
  updatedAt!: Date;
}

@InputType({ description: 'Payload to create a user' })
export class CreateUserInput {
  @Field({ description: 'Email address' })
  email!: string;

  @Field({ description: 'Given name' })
  firstName!: string;

  @Field({ description: 'Family name' })
  lastName!: string;

  @Field({ description: 'Telegram profile URL' })
  telegramUrl!: string;
}

@InputType({ description: 'Payload to update a user (all fields optional)' })
export class UpdateUserInput {
  @Field({ nullable: true, description: 'Email address' })
  email?: string;

  @Field({ nullable: true, description: 'Given name' })
  firstName?: string;

  @Field({ nullable: true, description: 'Family name' })
  lastName?: string;

  @Field({ nullable: true, description: 'Telegram profile URL' })
  telegramUrl?: string;
}

@ArgsType()
export class UsersQueryArgs {
  @Field(() => Int, { defaultValue: 1, description: 'Page number (1-based)' })
  @Min(1)
  page = 1;

  @Field(() => Int, {
    defaultValue: 20,
    description: 'Items per page (max 100)',
  })
  @Min(1)
  @Max(100)
  pageSize = 20;
}
