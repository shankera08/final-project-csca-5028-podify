/**
 * @jest-environment node
 */

import {GET} from './route'
import { Util } from './util'

describe('/api/queries/data-analyzer/category-show-duration', () => {
  test('returns total duration in hours for each category', async () => {
    const getCategoryShowDurationSpy = jest.spyOn(Util, 'getCategoryShowDuration').mockImplementation(() => [{cateoryId: 1, name: 'art', total_duration: 7200000}])
    const response = await GET()

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({
      categoryShowDuration: [
        { cateoryId: 1, name: 'art', total_duration: 2 },   
      ]
    })
    expect(getCategoryShowDurationSpy).toHaveBeenCalled()
    expect(getCategoryShowDurationSpy).toHaveBeenCalledTimes(1);
  })
})