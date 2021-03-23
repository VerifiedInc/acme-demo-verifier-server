import { Entity, Property } from '@mikro-orm/core';
import { Proof, Credential } from '@unumid/types';

import { BaseEntity, BaseEntityOptions } from './BaseEntity';

export interface PresentationEntityOptions extends BaseEntityOptions {
  presentationContext: ['https://www.w3.org/2018/credentials/v1', ...string[]];
  presentationUuid: string;
  presentationType: ['VerifiablePresentation', ...string[]];
  presentationVerifiableCredential: Credential[];
  presentationProof: Proof;
  presentationPresentationRequestUuid: string;
  isVerified: boolean;
}

@Entity({ tableName: 'Presentation' })
export class PresentationEntity extends BaseEntity {
  @Property()
  presentationContext: ['https://www.w3.org/2018/credentials/v1', ...string[]];

  @Property()
  presentationUuid: string;

  @Property()
  presentationType: ['VerifiablePresentation', ...string[]];

  @Property()
  presentationVerifiableCredential: Credential[];

  @Property()
  presentationProof: Proof;

  @Property()
  presentationPresentationRequestUuid: string;

  @Property()
  isVerified: boolean;

  constructor (options: PresentationEntityOptions) {
    super(options);

    const {
      presentationContext,
      presentationUuid,
      presentationType,
      presentationVerifiableCredential,
      presentationProof,
      presentationPresentationRequestUuid,
      isVerified
    } = options;

    this.presentationContext = presentationContext;
    this.presentationUuid = presentationUuid;
    this.presentationType = presentationType;
    this.presentationVerifiableCredential = presentationVerifiableCredential;
    this.presentationProof = presentationProof;
    this.presentationPresentationRequestUuid = presentationPresentationRequestUuid;
    this.isVerified = isVerified;
  }
}