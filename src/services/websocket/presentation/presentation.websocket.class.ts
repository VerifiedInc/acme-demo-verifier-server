import { Params } from '@feathersjs/feathers';
import { Presentation, PresentationPb, WithVersion } from '@unumid/types';
import { Service as MikroOrmService } from 'feathers-mikro-orm';

import { Application } from '../../../declarations';
import { NoPresentationEntity } from '../../../entities/NoPresentation';
import { PresentationEntity } from '../../../entities/Presentation';
import { DemoPresentationDto as DemoPresentationDtoDeprecated } from '@unumid/demo-types-deprecated-v2';
import { DemoPresentationDto } from '@unumid/demo-types';
import { lt } from 'semver';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ServiceOptions { }

const makeDemoPresentationDtoFromEntity = (entity: WithVersion<PresentationEntity>): DemoPresentationDto => {
  const {
    uuid,
    createdAt,
    updatedAt,
    presentationContext,
    presentationType,
    presentationVerifiableCredentials,
    presentationProof,
    presentationPresentationRequestId,
    isVerified,
    verifierDid
  } = entity;

  if (lt(entity.version, '2.0.0')) {
    return {
      uuid,
      createdAt,
      updatedAt,
      presentation: {
        '@context': presentationContext,
        uuid,
        type: presentationType,
        verifiableCredential: presentationVerifiableCredentials,
        verifierDid,
        proof: presentationProof,
        presentationRequestId: presentationPresentationRequestId
      },
      isVerified
    };
  }

  return {
    uuid,
    createdAt,
    updatedAt,
    presentation: {
      '@context': presentationContext,
      uuid,
      type: presentationType,
      verifiableCredential: presentationVerifiableCredentials,
      verifierDid,
      proof: presentationProof,
      presentationRequestId: presentationPresentationRequestId
    },
    isVerified
  };
};

const makeDemoPresentationDtoFromPresentation = (presentation: Presentation): DemoPresentationDto => {
  return {
    uuid: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    presentation,
    isVerified: true
  };
};

export class PresentationService {
    app: Application;
    options: ServiceOptions;
    presentationDataService: MikroOrmService<PresentationEntity>;
    noPresentationDataService: MikroOrmService<NoPresentationEntity>;

    constructor (options: ServiceOptions = {}, app: Application) {
      this.options = options;
      this.app = app;
      this.presentationDataService = app.service('presentationData');
      this.noPresentationDataService = app.service('noPresentationData');
    }

    async create (
      data: WithVersion<PresentationEntity> | NoPresentationEntity | Presentation | PresentationPb,
      params?: Params
    ): Promise<DemoPresentationDto | DemoPresentationDtoDeprecated> {
      // if (data.presentationType) {
      //   console.log();
      // }
      const response: DemoPresentationDto | DemoPresentationDtoDeprecated = makeDemoPresentationDtoFromEntity(data as WithVersion<PresentationEntity>);

      return response;
    }
}
