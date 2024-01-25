import { QueryTypes } from "sequelize";
import sequelize from "../../database";

interface Request {
  startDate: string;
  endDate: string;
  tenantId: string | number;
}

const query = `
  select
  dt_ref,
  to_char(dt_ref, 'DD/MM/YYYY') as label,
  qtd
  --ROUND(100.0*(qtd/sum(qtd) over ()), 2) pertentual
  from (
  select
  date_trunc('day', t."createdAt") dt_ref,
  count(1) as qtd
  from "Tickets" t
  where t."tenantId" = :tenantId
  and date_trunc('day', t."createdAt") between :startDate and :endDate
  group by date_trunc('day', t."createdAt")
  ) a
  order by 1
`;

const DashTicketsEvolutionByPeriod = async ({
  startDate,
  endDate,
  tenantId
}: Request): Promise<any[]> => {
  const data = await sequelize.query(query, {
    replacements: {
      tenantId,
      startDate,
      endDate
    },
    type: QueryTypes.SELECT
    // logging: console.log
  });
  return data;
};

export default DashTicketsEvolutionByPeriod;
