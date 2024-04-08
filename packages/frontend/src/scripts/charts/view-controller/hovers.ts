import { Milestone } from '@l2beat/config'

import { formatDate } from '../../../utils'
import { formatCurrency, formatCurrencyExactValue } from '../../../utils/format'
import { formatTps } from '../../../utils/formatTps'
import { isMobile } from '../../utils/isMobile'
import { POINT_CLASS_NAMES, PointShapeDefinition, PointStyle } from '../styles'
import { TokenInfo } from '../types'

export function renderMilestoneHover(milestone: Milestone) {
  return renderHover([
    renderDateRow(formatDate(milestone.date.slice(0, 10))),
    renderNameRow(milestone.name),
    milestone.description && renderDescriptionRow(milestone.description),
    isMobile() && renderMilestoneLink(milestone.link),
  ])
}

export interface TvlData {
  date: string
  usd: number
  eth: number
}

export function renderTvlHover(data: TvlData, useAltCurrency: boolean) {
  const formattedUsd = formatCurrencyExactValue(data.usd, 'USD')
  const formattedEth = formatCurrencyExactValue(data.eth, 'ETH')
  if (useAltCurrency) {
    return renderHover([
      renderDateRow(data.date),
      renderDetailedRow({
        title: 'ETH',
        value: formattedEth,
      }),
      renderDetailedRow({
        title: 'USD',
        value: formattedUsd,
      }),
    ])
  } else {
    return renderHover([
      renderDateRow(data.date),
      renderDetailedRow({
        title: 'USD',
        value: formattedUsd,
      }),
      renderDetailedRow({
        title: 'ETH',
        value: formattedEth,
      }),
    ])
  }
}

export interface DetailedTvlData {
  date: string
  usd: number
  cbv: number
  ebv: number
  nmv: number
  eth: number
  cbvEth: number
  ebvEth: number
  nmvEth: number
}

export function renderDetailedTvlHover(
  data: DetailedTvlData,
  useAltCurrency: boolean,
) {
  const currency = useAltCurrency ? 'eth' : 'usd'

  const total = useAltCurrency ? data.eth : data.usd
  const selectedCbv = useAltCurrency ? data.cbvEth : data.cbv
  const selectedEbv = useAltCurrency ? data.ebvEth : data.ebv
  const selectedNmv = useAltCurrency ? data.nmvEth : data.nmv

  return renderHover([
    renderDateRow(data.date),
    renderDetailedRow({
      title: 'Total TVL',
      value: formatCurrency(total, currency),
    }),
    renderHorizontalSeparator(),
    renderDetailedRow({
      title: 'Canonical',
      value: formatCurrency(selectedCbv, currency),
      icon: 'roundedPurpleSquare',
    }),
    renderDetailedRow({
      title: 'External',
      value: formatCurrency(selectedEbv, currency),
      icon: 'roundedYellowSquare',
    }),
    renderDetailedRow({
      title: 'Native',
      value: formatCurrency(selectedNmv, currency),
      icon: 'roundedPinkSquare',
    }),
  ])
}

export interface CostsData {
  date: string
  total: string
  calldata: string
  blobs: string | undefined
  compute: string
  overhead: string
}

export function renderCostsHover(data: CostsData) {
  return renderHover([
    renderDateRow(data.date),
    renderDetailedRow({
      title: 'Total',
      value: data.total,
    }),
    renderHorizontalSeparator(),
    renderDetailedRow({
      title: 'Calldata',
      value: data.calldata,
      icon: 'roundedBlueSquare',
    }),
    data.blobs &&
      renderDetailedRow({
        title: 'Blobs',
        value: data.blobs,
        icon: 'roundedLightYellowSquare',
      }),
    renderDetailedRow({
      title: 'Compute',
      value: data.compute,
      icon: 'roundedPinkSquare',
    }),
    renderDetailedRow({
      title: 'Overhead',
      value: data.overhead,
      icon: 'roundedPurpleSquare',
    }),
  ])
}

function renderMilestoneLink(link: string) {
  return `
  <a href="${link}" class="font-semibold pointer-events-auto text-blue-700 z-50 underline transition-colors hover:text-blue-550 dark:text-blue-500 dark:hover:text-blue-550" target="_blank" rel="noreferrer noopener">
    Learn more
  </a>`
}

export interface ActivityData {
  date: string
  tps: number
  ethTps: number
}

export function renderActivityHover(
  data: ActivityData,
  includeEthereumTps: boolean,
  isAggregate: boolean,
) {
  const projectTpsRow = renderDetailedRow({
    title: `Project${isAggregate ? 's' : ''}`,
    value: formatTps(data.tps),
    icon: 'redCircle',
  })
  const ethTpsRow = renderDetailedRow({
    title: 'Ethereum',
    value: formatTps(data.ethTps),
    icon: 'blueSquare',
  })
  if (!includeEthereumTps) {
    return renderHover([
      renderDateRow(data.date),
      renderDetailedRow({
        title: 'Average TPS',
      }),
      renderHorizontalSeparator(),
      projectTpsRow,
    ])
  }

  if (data.tps > data.ethTps) {
    return renderHover([
      renderDateRow(data.date),
      renderDetailedRow({
        title: 'Average TPS',
      }),
      renderHorizontalSeparator(),
      projectTpsRow,
      ethTpsRow,
    ])
  } else {
    return renderHover([
      renderDateRow(data.date),
      renderDetailedRow({
        title: 'Average TPS',
      }),
      renderHorizontalSeparator(),
      ethTpsRow,
      projectTpsRow,
    ])
  }
}

export interface TokenTvlData {
  date: string
  token: number
  usd: number
}

export function renderTokenTvlHover(
  data: TokenTvlData,
  tokenSymbol: string,
  tokenType: TokenInfo['type'],
) {
  const styles: Record<TokenInfo['type'], PointStyle | undefined> = {
    CBV: 'roundedPurpleSquare',
    EBV: 'roundedYellowSquare',
    NMV: 'roundedPinkSquare',
    regular: undefined,
  }
  const style = styles[tokenType]
  const formattedUsd = formatCurrencyExactValue(data.usd, 'USD')
  const formattedToken = formatCurrencyExactValue(data.token, tokenSymbol)
  return renderHover([
    renderDateRow(data.date),
    renderDetailedRow({
      title: tokenSymbol,
      value: formattedToken,
      icon: isMobile() ? undefined : style,
    }),
    renderDetailedRow({
      title: 'USD',
      value: formattedUsd,
      icon: isMobile() ? undefined : 'gap',
    }),
  ])
}

function renderHover(rows: (string | undefined | false)[]) {
  return rows.filter((x) => !!x).join('')
}

function renderDateRow(date: string) {
  return `<div class="mb-1 whitespace-nowrap">${date}</div>`
}

function renderHorizontalSeparator() {
  return `<hr class="w-full border-gray-200 dark:border-gray-650 md:border-t-1 my-1"/>`
}

interface DetailedRowProps {
  title: string
  shortTitle?: string
  value?: string
  icon?: PointStyle | 'gap'
}

function renderDetailedRow(props: DetailedRowProps) {
  const shortTitleHtml = props.shortTitle
    ? `<span class="text-gray-50 text-sm md:hidden">${props.shortTitle}</span>`
    : ''

  const valueHtml = props.value
    ? `<span class="font-bold tabular-nums whitespace-nowrap">${props.value}</span>`
    : ''
  return `
    <div class="flex w-full justify-between items-center gap-2">
      <div class="flex items-center gap-1">
        ${renderIcon(props.icon)}
        <span class="dark:text-gray-50 text-gray-700 text-sm ${
          props.shortTitle ? 'hidden md:inline' : ''
        }">${props.title}</span>
        ${shortTitleHtml}
      </div>
      ${valueHtml}
    </div>
  `
}

function renderIcon(icon?: PointStyle | 'gap') {
  if (icon === 'gap') {
    return `<div class="inline-block size-4"></div>`
  }

  if (!icon) return ''

  const point: PointShapeDefinition = POINT_CLASS_NAMES[icon]

  if (point.type === 'svg') {
    return `
    <div class="flex h-2.5 w-2.5 items-center justify-center">
      <svg
        viewBox="${point.svgViewBox}"
        role="img"
        aria-label="External asset icon"
        class="inline-block stroke-black dark:stroke-white ${point.className}"
        height="${point.height}"
        width="${point.width}"
        >
          ${point.svgShape}>
      </svg>
    </div>
  `
  }
  return `<div class="inline-block relative -top-px ${point.className}"></div>`
}

function renderNameRow(name: string) {
  return `<div class="max-w-[216px] mb-2 font-bold flex flex-wrap">
    <div class="absolute mt-[2px] md:mt-1 size-2.5 rotate-45 border-2 border-green-500 bg-green-700"></div>
  <span class='ml-4 text-left'>${name}</span></div>`
}

function renderDescriptionRow(description: string) {
  return `<div class="max-w-[216px] mb-1 text-left">${description}</div>`
}
