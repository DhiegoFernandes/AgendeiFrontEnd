import { useAnimate } from '@mui/x-charts/hooks';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import type { BarLabelProps } from '@mui/x-charts/BarChart';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { styled } from '@mui/material/styles';
import { interpolateObject } from '@mui/x-charts-vendor/d3-interpolate';
import type { EvolucaoMensal } from '../types/user';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GraficoEvolucaoMensalProps {
  dados: EvolucaoMensal[];
}

const Text = styled('text')(({ theme }) => ({
  ...theme?.typography?.body2,
  stroke: 'none',
  fill: '#000000', // preto
  fontWeight: 'bold',
  transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
  textAnchor: 'middle',
  dominantBaseline: 'central',
  pointerEvents: 'none',
}));

function BarLabel(props: BarLabelProps) {
  const {
    seriesId,
    dataIndex,
    color,
    isFaded,
    isHighlighted,
    classes,
    xOrigin,
    yOrigin,
    x,
    y,
    width,
    height,
    layout,
    skipAnimation,
    ...otherProps
  } = props;

  const animatedProps = useAnimate(
    { x: x + width / 2, y: y - 8 },
    {
      initialProps: { x: x + width / 2, y: yOrigin },
      createInterpolator: interpolateObject,
      transformProps: (p) => p,
      applyProps: (element: SVGTextElement, p) => {
        element.setAttribute('x', p.x.toString());
        element.setAttribute('y', p.y.toString());
      },
      skip: skipAnimation,
    },
  );

  return (
    <Text {...otherProps} fill="#000000" fontWeight="bold" textAnchor="middle" {...animatedProps} />
  );
}

export default function GraficoEvolucaoMensal({ dados }: GraficoEvolucaoMensalProps) {
  // Processar dados para o gráfico
  const meses = dados.map(item => {
    // Converter "2025-01" para "jan" (abreviação do mês)
    const data = parse(item.mes, 'yyyy-MM', new Date());
    return format(data, 'MMM', { locale: ptBR });
  });

  const faturamentos = dados.map(item => item.faturamento);

  // Função para formatar valores monetários
  const formatarValor = (valor: number) => {
    if (valor === 0) return '';
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
  };

  return (
    <ChartContainer
      xAxis={[{ scaleType: 'band', data: meses }]}
      series={[{ 
        type: 'bar', 
        id: 'faturamento', 
        data: faturamentos,
        color: '#9333ea', // purple-600
      }]}
      height={400}
      yAxis={[{ width: 60 }]}
      margin={{ left: 0, right: 10, top: 30 }}
      sx={(theme) => ({
        '& .MuiChartsAxis-root': {
          stroke: '#000000', // preto
          strokeWidth: '0.5px',
        },
        '& .MuiChartsAxis-tick': {
          stroke: '#000000', // preto
          strokeWidth: '0.5px',
        },
        '& .MuiChartsAxis-line': {
          strokeWidth: '0.5px',
        },
        '& .MuiChartsGrid-root': {
          stroke: '#e5e7eb', // gray-200 para grid
          strokeWidth: '0.5px',
        },
        '& line': {
          strokeWidth: '0.5px !important',
        },
        '& .MuiChartsAxis-tickLabel': {
          fill: '#000000 !important', // preto
          fontWeight: 'bold !important',
          fontSize: theme.typography.body2.fontSize,
          fontFamily: theme.typography.body2.fontFamily,
        },
        '& .MuiChartsAxis-label': {
          fill: '#000000 !important', // preto
          fontWeight: 'bold !important',
          fontSize: theme.typography.body2.fontSize,
          fontFamily: theme.typography.body2.fontFamily,
        },
        '& text': {
          fill: '#000000 !important', // preto
          fontWeight: 'bold !important',
          fontSize: `${theme.typography.body2.fontSize} !important`,
          fontFamily: `${theme.typography.body2.fontFamily} !important`,
        },
        '& .MuiBarElement-root': {
          fill: '#9333ea', // purple-600
          '&:hover': {
            fill: '#7e22ce', // purple-700
          },
        },
      })}
    >
      <BarPlot 
        barLabel={(params) => formatarValor(params.value as number)} 
        slots={{ barLabel: BarLabel }} 
      />
      <ChartsXAxis />
      <ChartsYAxis />
    </ChartContainer>
  );
}

