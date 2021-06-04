import { NullableId, Params } from '@feathersjs/feathers';
import { PresentationRequestPostDto } from '@unumid/types';
import { Service as MikroOrmService } from 'feathers-mikro-orm';
import { DemoPresentationRequestDto } from '@unumid/demo-types';
import { SendRequestResult } from '@unumid/server-sdk';

import { Application } from '../../../declarations';
import { PresentationRequestEntity, PresentationRequestEntityOptions } from '../../../entities/PresentationRequest';
import logger from '../../../logger';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ServiceOptions { }

const makePresentationRequestEntityOptionsFromDto = (
  dto: PresentationRequestPostDto
): PresentationRequestEntityOptions => {
  const {
    presentationRequest: {
      uuid: prUuid,
      id: prId,
      createdAt: prCreatedAt,
      updatedAt: prUpdatedAt,
      expiresAt: prExpiresAt,
      verifier: prVerifier,
      credentialRequests: prCredentialRequests,
      proof: prProof,
      metadata: prMetadata,
      holderAppUuid: prHolderAppUuid
    },
    verifier: prVerifierInfo,
    issuers: prIssuerInfo,
    holderApp: prHolderAppInfo,
    deeplink: prDeeplink,
    qrCode: prQrCode
  } = dto;

  return {
    prUuid,
    prId,
    prCreatedAt,
    prUpdatedAt,
    prExpiresAt,
    prVerifier,
    prCredentialRequests,
    prProof,
    prMetadata,
    prHolderAppUuid,
    prVerifierInfo,
    prIssuerInfo,
    prHolderAppInfo,
    prDeeplink,
    prQrCode
  };
};

const makeDemoPresentationRequestDtoFromEntity = (
  entity: PresentationRequestEntity
): DemoPresentationRequestDto => {
  const {
    uuid,
    createdAt,
    updatedAt,
    prUuid,
    prId,
    prCreatedAt,
    prUpdatedAt,
    prExpiresAt,
    prVerifier,
    prCredentialRequests,
    prProof,
    prMetadata,
    prHolderAppUuid,
    prVerifierInfo,
    prIssuerInfo,
    prHolderAppInfo,
    prDeeplink,
    prQrCode
  } = entity;

  return {
    uuid,
    createdAt,
    updatedAt,
    presentationRequestPostDto: {
      presentationRequest: {
        uuid: prUuid,
        id: prId as string,
        createdAt: prCreatedAt,
        updatedAt: prUpdatedAt,
        expiresAt: prExpiresAt,
        verifier: prVerifier,
        credentialRequests: prCredentialRequests,
        proof: prProof,
        metadata: prMetadata,
        holderAppUuid: prHolderAppUuid
      },
      verifier: prVerifierInfo,
      issuers: prIssuerInfo,
      holderApp: prHolderAppInfo,
      deeplink: prDeeplink,
      qrCode: prQrCode
    }
  };
};

export class PresentationRequestService {
  app: Application;
  options: ServiceOptions;
  dataService: MikroOrmService<PresentationRequestEntity>;

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
    this.dataService = app.service('presentationRequestData');
  }

  // async create (data: PresentationRequestPostDto, params?: Params): Promise<DemoPresentationRequestDto> {
  async create (data: SendRequestResult[], params?: Params): Promise<DemoPresentationRequestDto[]> {
    const result: DemoPresentationRequestDto[] = [];
    try {
      // data.forEach(async request => {
      for (let i = 0; i < data.length; i++) {
        // const request: PresentationRequestPostDto = data[data.length - 1] as PresentationRequestPostDto;
        const request = data[i];
        const entity = await this.dataService.create(makePresentationRequestEntityOptionsFromDto(request as PresentationRequestPostDto), params);
        result.push(await makeDemoPresentationRequestDtoFromEntity(entity));
      }

      // });
    } catch (e) {
      logger.error('PresentationRequestService.create caught an error thrown by PresentationRequestDataService.create', e);
      throw e;
    }

    // return makeDemoPresentationRequestDtoFromEntity(entity);
    return result;
  }

  async get (uuid: NullableId, params?: Params): Promise<DemoPresentationRequestDto> {
    let entity;
    try {
      entity = await this.dataService.get(uuid, params);
    } catch (e) {
      logger.error('PresentationRequestService.get caught an error thrown by PresentationRequestDataService.get', e);
      throw e;
    }

    return makeDemoPresentationRequestDtoFromEntity(entity);
  }
}
