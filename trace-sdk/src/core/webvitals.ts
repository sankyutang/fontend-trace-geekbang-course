import { Metric, onCLS, onFID, onLCP, onTTFB, onINP, onFCP } from 'web-vitals'
import { createApiReporter, getDeviceInfo } from 'web-vitals-reporter'

const SCORE_RANGE_LCP: [number, number] = [2500, 4500]
const SCORE_RANGE_FID: [number, number] = [100, 300]
const SCORE_RANGE_CLS: [number, number] = [0.1, 0.25]
const SCORE_RANGE_FCP: [number, number] = [1.8, 3]
const SCORE_RANGE_INP: [number, number] = [200, 500]
const SCORE_RANGE_TTFB: [number, number] = [800, 1800]

const score = (value: number, range: [number, number]) => {
  return value < range[0] ? 'good' : value < range[1] ? 'needs improvement' : 'poor'
}

export function generateUniqueId() {
  return `v1-${Date.now()}-${Math.floor(Math.random() * (9e12 - 1)) + 1e12}`
}

function round(val, precision = 0) {
  // @ts-ignore
  return +(Math.round(`${val}e+${precision}`) + `e-${precision}`)
}

export function mapMetric(metric) {
  const isWebVital = ['FCP', 'TTFB', 'LCP', 'CLS', 'FID'].indexOf(metric.name) !== -1;
  return {
    [metric.name]: isWebVital ? round(metric.value, metric.name === 'CLS' ? 4 : 0) : metric.value,
    [`${metric.name}Rating`]: metric.rating
  }
};

const sendToAnalytics = createApiReporter('/analytics', {
  initial: getDeviceInfo(),
  beforeSend: (result) => {
    console.log('beforeSend')
    const { LCP, FID, CLS } = result
    console.info('web-vitals: ', result)
    if (!LCP || !FID || !CLS) return // Core Web Vitals are not supported

    // return extra attributes to merge into the final result
    return {
      LCPScore: score(LCP, SCORE_RANGE_LCP),
      // FIDScore: FID < 100 ? 'good' : FID < 300 ? 'needs improvement' : 'poor',
      FIDScore: score(FID, SCORE_RANGE_FID),
      // CLSScore: CLS < 0.1 ? 'good' : CLS < 0.25 ? 'needs improvement' : 'poor'
      CLSScore: score(CLS, SCORE_RANGE_CLS),
    }
  },
})


export const onVitals = (saveMetric) => {
  console.log('webvitals setup')
  onLCP(saveMetric)
  onFID(saveMetric)
  onCLS(saveMetric)
  // onTTFB(saveMetric)
  // onINP(saveMetric)
  // onFCP(saveMetric)
}

export default {}
