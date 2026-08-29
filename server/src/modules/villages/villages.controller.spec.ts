import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';
import { VillagesController } from './villages.controller.js';

describe('VillagesController', () => {
  const service = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };
  const controller = new VillagesController(service as never);

  beforeEach(() => vi.clearAllMocks());

  it('rejects an invalid village payload', () => {
    const pipe = new ZodValidationPipe(
      z.object({
        name: z.string().min(2),
        district: z.string().min(2),
        state: z.string().min(2),
      }),
    );
    expect(() =>
      pipe.transform(
        { name: 'A' },
        { type: 'body', metatype: Object, data: '' },
      ),
    ).toThrow(BadRequestException);
    expect(service.create).not.toHaveBeenCalled();
  });

  it('delegates a valid village payload to the service', () => {
    const payload = {
      name: 'Dholera',
      district: 'Ahmedabad',
      state: 'Gujarat',
    };
    controller.create(payload);
    expect(service.create).toHaveBeenCalledWith(payload);
  });

  it('rejects an empty patch payload', () => {
    const pipe = new ZodValidationPipe(
      z
        .object({
          name: z.string().min(2),
          district: z.string().min(2),
          state: z.string().min(2),
        })
        .partial()
        .refine(
          (value) => Object.keys(value).length > 0,
          'At least one field is required',
        ),
    );
    expect(() =>
      pipe.transform({}, { type: 'body', metatype: Object, data: '' }),
    ).toThrow(BadRequestException);
    expect(service.update).not.toHaveBeenCalled();
  });
});
