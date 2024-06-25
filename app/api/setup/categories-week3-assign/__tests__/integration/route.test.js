/**
 * @jest-environment node
 */

import {POST as POSTC} from '../../create-category-table/route'
import {POST as POSTA} from '../../add-categories/route'
import { Utils } from '../../utils'

beforeEach(() => {
  // Reset mock implementation before each test
  jest.resetAllMocks()
});

describe('/api/setup/categories - Integration test', () => {
    test('call create-category-table', async () => {
      const createCategoryTableSpy = jest.spyOn(Utils, 'createCategoryTable').mockImplementation(() => true)
      
      const response = await POSTC()
  
      expect(response.status).toBe(200)
      expect(createCategoryTableSpy).toHaveBeenCalled()
      expect(createCategoryTableSpy).toHaveBeenCalledTimes(1);
    })

    test('call add-categories route', async () => {
      const getCategoryDataFromAPISpy = jest.spyOn(Utils, 'getCategoryDataFromAPI').mockImplementation(() => ({
          response: {
              categories: [{ category_id: 1, name: 'Art', level: 1 }, { category_id: 1, name: 'Painting', level: 2 }]
          }
      }))
    const upsertCategoriesSpy = jest.spyOn(Utils, 'upsertCategories').mockImplementation(() => true)
    
    const response = await POSTA()

    expect(response.status).toBe(200)
    expect(getCategoryDataFromAPISpy).toHaveBeenCalled()
    expect(getCategoryDataFromAPISpy).toHaveBeenCalledTimes(1);
    expect(upsertCategoriesSpy).toHaveBeenCalled()
    expect(upsertCategoriesSpy).toHaveBeenCalledTimes(1);
    expect(upsertCategoriesSpy).toHaveBeenCalledWith([{ category_id: 1, name: 'Art', level: 1 }])
  })
  })