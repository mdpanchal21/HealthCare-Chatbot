import { NotFoundException } from '@nestjs/common';
import { HospitalBusinessService } from './hospitals/hospital-business.service.js';
import { HospitalProcedureBusinessService } from './hospital-procedures/hospital-procedure-business.service.js';
import { ProcedureBusinessService } from './procedures/procedure-business.service.js';
import { SchemeBusinessService } from './schemes/scheme-business.service.js';

describe('Business APIs', () => {
  it('returns an approximate cost with null unavailable components', async () => {
    const repository = { findOne: vi.fn().mockResolvedValue({ hospital: { id: 'h', name: 'Hospital' }, procedure: { id: 'p', name: 'Procedure' }, priceMin: 100, priceMax: 200, doctorChargeMin: null, doctorChargeMax: null, operationChargeMin: 20, operationChargeMax: 30, roomChargeMin: null, roomChargeMax: null, medicineChargeMin: null, medicineChargeMax: null, testChargeMin: null, testChargeMax: null, otChargeMin: null, otChargeMax: null, anesthesiaChargeMin: null, anesthesiaChargeMax: null, otherChargeMin: null, otherChargeMax: null }) };
    const service = new HospitalProcedureBusinessService(repository as never);
    const result = await service.cost('h', 'p');
    expect(result.data.estimatedTotal).toEqual({ min: 100, max: 200 });
    expect(result.data.breakdown.room).toBeNull();
  });

  it('rejects comparison when a selected hospital is missing', async () => {
    const hospitals = { find: vi.fn().mockResolvedValue([]) };
    const procedures = { findOne: vi.fn() };
    const service = new HospitalBusinessService(hospitals as never, procedures as never);
    await expect(service.compare({ hospitalIds: ['h'], procedureId: 'p' })).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rejects procedure hospital lookup when the procedure is missing', async () => {
    const procedures = { findOneBy: vi.fn().mockResolvedValue(null) };
    const links = { createQueryBuilder: vi.fn() };
    const service = new ProcedureBusinessService(procedures as never, links as never);
    await expect(service.hospitals('p', { page: 1, limit: 20 })).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rejects scheme hospital lookup when the scheme is missing', async () => {
    const schemes = { findOneBy: vi.fn().mockResolvedValue(null) };
    const links = { createQueryBuilder: vi.fn() };
    const service = new SchemeBusinessService(schemes as never, links as never);
    await expect(service.hospitals('s', { page: 1, limit: 20 })).rejects.toBeInstanceOf(NotFoundException);
  });
});