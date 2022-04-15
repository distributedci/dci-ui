import { Card, CardBody } from "@patternfly/react-core";
import MainPage from "pages/MainPage";
import { Breadcrumb } from "ui";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  Bar,
  Legend,
} from "recharts";

export default function JunitComparisonPage() {
  const data = {
    details: [
      {
        testcase: "benchTPCDS/TPCDS_Q51_SF10_TPCDS_Q51_cpu time",
        value: 63.11775903000951,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q44_SF10_TPCDS_Q44_cpu time",
        value: 41.882816293345186,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q51_SF10_TPCDS_Q51_elapsed time / query",
        value: 40.962820937737646,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q44_SF10_TPCDS_Q44_elapsed time / query",
        value: 39.76777430143493,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q84_SF10_TPCDS_Q84_cpu time",
        value: 34.37251599497773,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q91_SF10_TPCDS_Q91_cpu time",
        value: 33.25733921853238,
      },
      {
        testcase:
          "benchCppSoltp_Select/05_02_t05: resultset has one row_ 100 threads (all same workload)_elapsed time",
        value: 30.38095942293313,
      },
      {
        testcase:
          "benchCppSoltp_Insert/01_A02_t01: Delta (no merges)_elapsed time",
        value: 27.243279813556082,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q61_SF10_TPCDS_Q61_cpu time",
        value: 26.00143541507415,
      },
      {
        testcase:
          "benchCppSoltp_Insert/01_16_t01: Delta (no merges)_elapsed time",
        value: 25.448371398749224,
      },
      {
        testcase: "benchCppSoltp_Insert/02_15_t02: Row Store_elapsed time",
        value: 25.309367644964144,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_02_t01: Table in Delta_ no merges_elapsed time",
        value: 24.296703715987192,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_02_t02: Table in Main_ no merges_elapsed time",
        value: 23.54864375715267,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q83_SF10_TPCDS_Q83_cpu time",
        value: 22.628829221823654,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_02_t01: Table in Delta_ no merges_cpu time",
        value: 22.044941013002827,
      },
      {
        testcase:
          "benchCppSoltp_Select/05_05_t05: resultset has one row_ 100 threads (all same workload)_elapsed time",
        value: 22.016087702488964,
      },
      {
        testcase:
          "benchCppSoltp_Insert/01_17_t01: Delta (no merges)_elapsed time",
        value: 21.68232596843279,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_02_t02: Table in Main_ no merges_cpu time",
        value: 20.66413337441378,
      },
      {
        testcase: "benchCppSoltp_Insert/02_16_t02: Row Store_elapsed time",
        value: 19.773947230923838,
      },
      {
        testcase:
          "benchCppSoltp_Delete/01_07_t01: Table in Delta_ no merges_elapsed time",
        value: 19.522126361570546,
      },
      {
        testcase:
          "benchCppSoltp_Delete/02_06_t02: Table in Main_ no merges_elapsed time",
        value: 19.423337588945,
      },
      {
        testcase: "benchCppSoltp_Update/03_08_t03: Row Store_elapsed time",
        value: 19.14617470507813,
      },
      {
        testcase:
          "benchCppSoltp_Delete/01_08_t01: Table in Delta_ no merges_elapsed time",
        value: 19.09723800468445,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q61_SF10_TPCDS_Q61_elapsed time / query",
        value: 18.92132918511923,
      },
      {
        testcase: "benchCppSoltp_Update/03_15_t03: Row Store_elapsed time",
        value: 18.27082999244003,
      },
      {
        testcase:
          "benchCppSoltp_Delete/01_06_t01: Table in Delta_ no merges_elapsed time",
        value: 18.244735701038053,
      },
      {
        testcase: "benchCppSoltp_Update/03_07_t03: Row Store_elapsed time",
        value: 18.22731186028398,
      },
      {
        testcase: "benchCppSoltp_Update/03_06_t03: Row Store_elapsed time",
        value: 18.164588173084418,
      },
      {
        testcase:
          "benchCppSoltp_Delete/02_08_t02: Table in Main_ no merges_elapsed time",
        value: 18.095039400924,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/05_04_t05: P*Time_ 100 threads x 5k reps_elapsed time",
        value: 18.08072795711305,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q64_SF10_TPCDS_Q64_cpu time",
        value: 17.725465603922302,
      },
      {
        testcase: "benchCppSoltp_Update/03_00_t03: Row Store_cpu time",
        value: 17.661968661745558,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q92_SF10_TPCDS_Q92_cpu time",
        value: 17.597570411574104,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q85_SF10_TPCDS_Q85_cpu time",
        value: 17.543107693810448,
      },
      {
        testcase:
          "benchCppSoltp_Insert/01_11_t01: Delta (no merges)_elapsed time",
        value: 17.457958756751406,
      },
      {
        testcase: "benchCppSoltp_Update/03_01_t03: Row Store_cpu time",
        value: 17.437690086093983,
      },
      {
        testcase: "benchCppSoltp_Delete/03_08_t03: Row Store_elapsed time",
        value: 17.433531936703194,
      },
      {
        testcase:
          "benchCppSoltp_Delete/02_00_t02: Table in Main_ no merges_cpu time",
        value: 17.412216506463665,
      },
      {
        testcase: "benchCppSoltp_Insert/01_11_t01: Delta (no merges)_cpu time",
        value: 17.16061338831092,
      },
      {
        testcase: "benchCppSoltp_Delete/03_07_t03: Row Store_elapsed time",
        value: 17.062533271532867,
      },
      {
        testcase: "benchCppSoltp_Insert/02_A02_t02: Row Store_elapsed time",
        value: 17.036530054132808,
      },
      {
        testcase: "benchCppSoltp_Delete/03_01_t03: Row Store_cpu time",
        value: 17.019853412082803,
      },
      {
        testcase: "benchCppSoltp_Delete/03_02_t03: Row Store_cpu time",
        value: 16.95635012742556,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q12_SF10_TPCDS_Q12_cpu time",
        value: 16.925410550572114,
      },
      {
        testcase:
          "benchVdm/01_NumClientsHalfCpu_Queries/sec (query 1)_Throughput",
        value: 16.812548291395064,
      },
      {
        testcase: "benchCppSoltp_Update/03_16_t03: Row Store_elapsed time",
        value: 16.722292064053367,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_17_t02: Table in Main_ no merges_elapsed time",
        value: 16.6616155482927,
      },
      {
        testcase:
          "benchCppSoltp_Delete/02_07_t02: Table in Main_ no merges_elapsed time",
        value: 16.6071665201344,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q94_SF10_TPCDS_Q94_cpu time",
        value: 16.587927465829,
      },
      {
        testcase:
          "benchVdm/01_NumClientsHalfCpu_Queries/sec (query 0)_Throughput",
        value: 16.287453703017892,
      },
      {
        testcase: "benchCppSoltp_Update/03_02_t03: Row Store_cpu time",
        value: 16.018865302374337,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/02_02_t02: JoinEngine_ 100 threads x 5k reps_elapsed time",
        value: 15.837333960998826,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_16_t02: Table in Main_ no merges_elapsed time",
        value: 15.604704585453389,
      },
      {
        testcase:
          "benchCppSoltp_Select/05_04_t05: resultset has one row_ 100 threads (all same workload)_elapsed time",
        value: 15.572567783094113,
      },
      {
        testcase:
          "benchCppSoltp_Delete/01_00_t01: Table in Delta_ no merges_cpu time",
        value: 15.275525229690754,
      },
      {
        testcase: "benchCppSoltp_Insert/01_14_t01: Delta (no merges)_cpu time",
        value: 15.227422989024642,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/02_00_t02: JoinEngine_ 100 threads x 5k reps_elapsed time",
        value: 15.2206716651564,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_08_t02: Table in Main_ no merges_elapsed time",
        value: 15.183812023901975,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q54_SF10_TPCDS_Q54_cpu time",
        value: 15.127166811849055,
      },
      {
        testcase: "benchVdm/01_NumClientsHalfCpu_Queries/sec_Throughput",
        value: 14.939438690628926,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/05_03_t05: P*Time_ 100 threads x 5k reps_elapsed time",
        value: 14.920056787064441,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q84_SF10_TPCDS_Q84_elapsed time / query",
        value: 14.842824140513162,
      },
      {
        testcase:
          "benchCppSoltp_Update/00_02_t00: Table in Main_ regularly merged_cpu time",
        value: 14.835210038829839,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_07_t02: Table in Main_ no merges_elapsed time",
        value: 14.824529651020812,
      },
      {
        testcase:
          "benchCppSoltp_Update/00_11_t00: Table in Main_ regularly merged_elapsed time",
        value: 14.685536509485667,
      },
      {
        testcase:
          "benchCppSoltp_Insert/00_11_t00: Main (regular merges)_elapsed time",
        value: 14.677299777586272,
      },
      {
        testcase:
          "benchCppSoltp_Insert/00_14_t00: Main (regular merges)_cpu time",
        value: 14.648716561192318,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_17_t01: Table in Delta_ no merges_elapsed time",
        value: 14.21684233220779,
      },
      {
        testcase: "benchCppSoltp_Delete/03_00_t03: Row Store_cpu time",
        value: 13.960059960178427,
      },
      {
        testcase:
          "benchCppSoltp_Delete/02_02_t02: Table in Main_ no merges_cpu time",
        value: 13.926267572263509,
      },
      {
        testcase:
          "benchCppSoltp_Delete/02_01_t02: Table in Main_ no merges_cpu time",
        value: 13.709033522882688,
      },
      {
        testcase:
          "benchVdm/01_NumClientsHalfCpu_Queries/sec (query 2)_Throughput",
        value: 13.708150900501174,
      },
      {
        testcase: "benchCppSoltp_Update/03_00_t03: Row Store_elapsed time",
        value: 13.583605343323827,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/05_02_t05: P*Time_ 100 threads x 5k reps_elapsed time",
        value: 13.551366264740427,
      },
      {
        testcase: "benchCppSoltp_Update/03_09_t03: Row Store_cpu time",
        value: 13.525117448735573,
      },
      {
        testcase: "benchCppSoltp_Delete/03_06_t03: Row Store_elapsed time",
        value: 13.521219524759251,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_00_t02: Table in Main_ no merges_cpu time",
        value: 13.465963267058644,
      },
      {
        testcase:
          "benchCppSoltp_Delete/01_01_t01: Table in Delta_ no merges_cpu time",
        value: 13.395631827401964,
      },
      {
        testcase:
          "benchVdm/01_NumClientsHalfCpu_Queries/sec (query 3)_Throughput",
        value: 13.374298113350331,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/02_01_t02: JoinEngine_ 100 threads x 5k reps_elapsed time",
        value: 13.355674681255673,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_16_t01: Table in Delta_ no merges_elapsed time",
        value: 13.299290664159093,
      },
      {
        testcase:
          "benchCppSoltp_Select/05_01_t05: resultset has one row_ 100 threads (all same workload)_elapsed time",
        value: 13.275112800171136,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q32_SF10_TPCDS_Q32_cpu time",
        value: 13.208366560530186,
      },
      {
        testcase:
          "benchCppSoltp_Delete/01_02_t01: Table in Delta_ no merges_cpu time",
        value: 13.195918302785069,
      },
      {
        testcase: "benchCppSoltp_Insert/02_09_t02: Row Store_cpu time",
        value: 13.162238395375578,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_00_t01: Table in Delta_ no merges_cpu time",
        value: 13.033067898456867,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_15_t02: Table in Main_ no merges_elapsed time",
        value: 12.923806051768121,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/05_00_t05: P*Time_ 100 threads x 5k reps_elapsed time",
        value: 12.905109567286466,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_09_t01: Table in Delta_ no merges_cpu time",
        value: 12.616039018186974,
      },
      {
        testcase:
          "benchCppSoltp_Insert/01_15_t01: Delta (no merges)_elapsed time",
        value: 12.61368970717135,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_09_t02: Table in Main_ no merges_cpu time",
        value: 12.548442279126249,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q91_SF10_TPCDS_Q91_elapsed time / query",
        value: 12.409421452669646,
      },
      {
        testcase:
          "benchCppSoltp_Select/05_A00_t05: resultset has one row_ 100 threads (all same workload)_elapsed time",
        value: 12.158743297641374,
      },
      {
        testcase: "benchCppSoltp_Update/03_11_t03: Row Store_cpu time",
        value: 11.895476111249486,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q96_SF10_TPCDS_Q96_cpu time",
        value: 11.840512508439998,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_06_t02: Table in Main_ no merges_elapsed time",
        value: 11.707642644734179,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q98_SF10_TPCDS_Q98_cpu time",
        value: 11.42458630141999,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q42_SF10_TPCDS_Q42_cpu time",
        value: 11.361706209280257,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/05_01_t05: P*Time_ 100 threads x 5k reps_elapsed time",
        value: 11.34068476471512,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q89_SF10_TPCDS_Q89_elapsed time / query",
        value: 11.312737274690594,
      },
      {
        testcase: "benchCppSoltp_Update/03_01_t03: Row Store_elapsed time",
        value: 11.257049749441292,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q81_SF10_TPCDS_Q81_cpu time",
        value: 11.239238180250323,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_01_t01: Table in Delta_ no merges_cpu time",
        value: 11.129276033137192,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q95_SF10_TPCDS_Q95_cpu time",
        value: 10.832508802959268,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q96_SF10_TPCDS_Q96_elapsed time / query",
        value: 10.694363252019736,
      },
      {
        testcase:
          "benchCppSoltp_Update/00_09_t00: Table in Main_ regularly merged_cpu time",
        value: 10.591386779757437,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q90_SF10_TPCDS_Q90_cpu time",
        value: 10.574060828110158,
      },
      {
        testcase:
          "benchCppSoltp_Insert/01_14_t01: Delta (no merges)_elapsed time",
        value: 10.480616732410402,
      },
      {
        testcase: "benchCppSoltp_Insert/02_11_t02: Row Store_cpu time",
        value: 10.373366594006058,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q53_SF10_TPCDS_Q53_cpu time",
        value: 10.316598310194703,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_01_t02: Table in Main_ no merges_cpu time",
        value: 10.288340660855873,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q30_SF10_TPCDS_Q30_cpu time",
        value: 10.22867359721814,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q63_SF10_TPCDS_Q63_cpu time",
        value: 10.18035346550938,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q92_SF10_TPCDS_Q92_elapsed time / query",
        value: 10.141770449546797,
      },
      {
        testcase:
          "benchCppSoltp_Select/05_A01_t05: resultset has one row_ 100 threads (all same workload)_elapsed time",
        value: 10.07295117509322,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q48_SF10_TPCDS_Q48_cpu time",
        value: 10.01331806049578,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_14_t02: Table in Main_ no merges_cpu time",
        value: 10.002555679202624,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q20_SF10_TPCDS_Q20_cpu time",
        value: 9.779566086165044,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q83_SF10_TPCDS_Q83_elapsed time / query",
        value: 9.682918306917982,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q93_SF10_TPCDS_Q93_cpu time",
        value: 9.65510211076716,
      },
      {
        testcase: "benchCppSoltp_Update/03_09_t03: Row Store_elapsed time",
        value: 9.549693441187138,
      },
      {
        testcase:
          "benchCppSoltp_Update/00_00_t00: Table in Main_ regularly merged_cpu time",
        value: 9.359373071268095,
      },
      {
        testcase: "benchCppSoltp_Insert/02_17_t02: Row Store_elapsed time",
        value: 9.284412835758447,
      },
      {
        testcase:
          "benchCppSoltp_Insert/00_09_t00: Main (regular merges)_cpu time",
        value: 9.282756317488493,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q54_SF10_TPCDS_Q54_elapsed time / query",
        value: 9.227117889346559,
      },
      {
        testcase:
          "benchCppSoltp_Delete/02_00_t02: Table in Main_ no merges_elapsed time",
        value: 9.156037534415914,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_08_t01: Table in Delta_ no merges_elapsed time",
        value: 9.126020423091484,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q03_SF10_TPCDS_Q03_cpu time",
        value: 8.983050736553208,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q89_SF10_TPCDS_Q89_cpu time",
        value: 8.974880236441672,
      },
      {
        testcase:
          "benchCppSoltp_Select/02_02_t02: empty resultset_ 100 threads (all same workload)_elapsed time",
        value: 8.955196712824211,
      },
      {
        testcase: "benchCppSoltp_Insert/01_09_t01: Delta (no merges)_cpu time",
        value: 8.85429745606737,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q42_SF10_TPCDS_Q42_elapsed time / query",
        value: 8.853561265720709,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q16_SF10_TPCDS_Q16_cpu time",
        value: 8.849808683492473,
      },
      {
        testcase: "benchCppSoltp_Update/03_10_t03: Row Store_cpu time",
        value: 8.782258617480712,
      },
      {
        testcase:
          "benchCppSoltp_Select/02_00_t02: empty resultset_ 100 threads (all same workload)_elapsed time",
        value: 8.679818546260215,
      },
      {
        testcase:
          "benchCppSoltp_Delete/01_00_t01: Table in Delta_ no merges_elapsed time",
        value: 8.57227083305418,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_11_t01: Table in Delta_ no merges_elapsed time",
        value: 8.562638430698183,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q15_SF10_TPCDS_Q15_cpu time",
        value: 8.43693472415846,
      },
      {
        testcase: "benchCppSoltp_Insert/02_09_t02: Row Store_elapsed time",
        value: 8.427603282069086,
      },
      {
        testcase: "benchCppSoltp_Insert/02_10_t02: Row Store_cpu time",
        value: 8.364256393577687,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_11_t01: Table in Delta_ no merges_cpu time",
        value: 8.279232991412357,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q02_SF10_TPCDS_Q02_cpu time",
        value: 8.110736533122498,
      },
      {
        testcase:
          "benchCppSoltp_Insert/00_11_t00: Main (regular merges)_cpu time",
        value: 8.02281240921672,
      },
      {
        testcase:
          "benchCppSoltp_Select/02_03_t02: empty resultset_ 100 threads (all same workload)_elapsed time",
        value: 7.9600932241722795,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q02_SF10_TPCDS_Q02_elapsed time / query",
        value: 7.939038477608321,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q21_SF10_TPCDS_Q21_cpu time",
        value: 7.900737598748169,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q34_SF10_TPCDS_Q34_cpu time",
        value: 7.888111129036688,
      },
      {
        testcase:
          "benchCppSoltp_Select/02_01_t02: empty resultset_ 100 threads (all same workload)_elapsed time",
        value: 7.874887788985433,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q41_SF10_TPCDS_Q41_cpu time",
        value: 7.859126438237651,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q47_SF10_TPCDS_Q47_elapsed time / query",
        value: 7.833889818529223,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q43_SF10_TPCDS_Q43_cpu time",
        value: 7.831138756847079,
      },
      {
        testcase:
          "benchCppSoltp_Update/00_02_t00: Table in Main_ regularly merged_elapsed time",
        value: 7.790209790209727,
      },
      {
        testcase: "benchCppSoltp_Update/03_17_t03: Row Store_elapsed time",
        value: 7.762197529072024,
      },
      {
        testcase: "benchCppSoltp_Insert/02_A00_t02: Row Store_cpu time",
        value: 7.670090368084646,
      },
      {
        testcase:
          "benchCppSoltp_Select/05_00_t05: resultset has one row_ 100 threads (all same workload)_elapsed time",
        value: 7.66309862665909,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_10_t02: Table in Main_ no merges_cpu time",
        value: 7.652323210644949,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q63_SF10_TPCDS_Q63_elapsed time / query",
        value: 7.582919009339698,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q59_SF10_TPCDS_Q59_cpu time",
        value: 7.566108218249077,
      },
      {
        testcase: "benchCppSoltp_Insert/01_A01_t01: Delta (no merges)_cpu time",
        value: 7.548020431897798,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q26_SF10_TPCDS_Q26_cpu time",
        value: 7.437594432976536,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_00_t02: Table in Main_ no merges_elapsed time",
        value: 7.36973847712892,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_09_t01: Table in Delta_ no merges_elapsed time",
        value: 7.361407138145144,
      },
      {
        testcase: "benchCppSoltp_Update/03_02_t03: Row Store_elapsed time",
        value: 7.272387732703438,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_00_t01: Table in Delta_ no merges_elapsed time",
        value: 7.215715800097432,
      },
      {
        testcase: "benchCppSoltp_Insert/01_13_t01: Delta (no merges)_cpu time",
        value: 7.076546743940605,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q29_SF10_TPCDS_Q29_cpu time",
        value: 7.031271145502799,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q21_SF10_TPCDS_Q21_elapsed time / query",
        value: 7.029528994601132,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_10_t01: Table in Delta_ no merges_cpu time",
        value: 7.022811448055764,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q90_SF10_TPCDS_Q90_elapsed time / query",
        value: 7.010465921657384,
      },
      {
        testcase:
          "benchCppSoltp_Insert/00_A00_t00: Main (regular merges)_elapsed time",
        value: 7.00329570832584,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_07_t01: Table in Delta_ no merges_elapsed time",
        value: 6.961553374891858,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q94_SF10_TPCDS_Q94_elapsed time / query",
        value: 6.958238132117864,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q69_SF10_TPCDS_Q69_cpu time",
        value: 6.933541749763564,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q57_SF10_TPCDS_Q57_elapsed time / query",
        value: 6.882893556073249,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q53_SF10_TPCDS_Q53_elapsed time / query",
        value: 6.7500158949605815,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q25_SF10_TPCDS_Q25_cpu time",
        value: 6.671093655169272,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q33_SF10_TPCDS_Q33_cpu time",
        value: 6.654691927235296,
      },
      {
        testcase:
          "benchCppSoltp_Update/00_14_t00: Table in Main_ regularly merged_elapsed time",
        value: 6.615312613039378,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q57_SF10_TPCDS_Q57_cpu time",
        value: 6.6090130716733295,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q64_SF10_TPCDS_Q64_elapsed time / query",
        value: 6.582996368192246,
      },
      {
        testcase: "benchCppSoltp_Delete/03_01_t03: Row Store_elapsed time",
        value: 6.528166765027438,
      },
      {
        testcase: "benchCppSoltp_Delete/03_00_t03: Row Store_elapsed time",
        value: 6.459489524042516,
      },
      {
        testcase:
          "benchCppSoltp_Insert/00_A01_t00: Main (regular merges)_cpu time",
        value: 6.446350153434405,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q58_SF10_TPCDS_Q58_cpu time",
        value: 6.442458415018995,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_09_t02: Table in Main_ no merges_elapsed time",
        value: 6.434618691712446,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q40_SF10_TPCDS_Q40_cpu time",
        value: 6.421058494212894,
      },
      {
        testcase:
          "benchCppSoltp_Insert/00_14_t00: Main (regular merges)_elapsed time",
        value: 6.375129959311437,
      },
      {
        testcase: "benchCppSoltp_Insert/01_A00_t01: Delta (no merges)_cpu time",
        value: 6.311382171553206,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q49_SF10_TPCDS_Q49_cpu time",
        value: 6.309016938335955,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q10_SF10_TPCDS_Q10_cpu time",
        value: 6.247747772105458,
      },
      {
        testcase:
          "benchCppSoltp_Update/00_14_t00: Table in Main_ regularly merged_cpu time",
        value: 6.1820539504665115,
      },
      {
        testcase: "benchCppSoltp_Insert/01_10_t01: Delta (no merges)_cpu time",
        value: 6.042771094999039,
      },
      {
        testcase:
          "benchCppSoltp_Select/02_05_t02: empty resultset_ 100 threads (all same workload)_elapsed time",
        value: 6.0162660303397715,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_15_t01: Table in Delta_ no merges_elapsed time",
        value: 6.010309881277629,
      },
      {
        testcase:
          "benchCppSoltp_Update/00_09_t00: Table in Main_ regularly merged_elapsed time",
        value: 5.984371123650993,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q47_SF10_TPCDS_Q47_cpu time",
        value: 5.976840524323176,
      },
      {
        testcase:
          "benchCppSoltp_Insert/00_10_t00: Main (regular merges)_cpu time",
        value: 5.875768041912242,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q08_SF10_TPCDS_Q08_cpu time",
        value: 5.748589259473759,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q62_SF10_TPCDS_Q62_cpu time",
        value: 5.7384961852246406,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q13_SF10_TPCDS_Q13_cpu time",
        value: 5.687703528574087,
      },
      {
        testcase:
          "benchCppSoltp_Delete/01_01_t01: Table in Delta_ no merges_elapsed time",
        value: 5.647426912600227,
      },
      {
        testcase: "benchCppSoltp_Insert/02_11_t02: Row Store_elapsed time",
        value: 5.629992468066111,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_01_t01: Table in Delta_ no merges_elapsed time",
        value: 5.628993610223621,
      },
      {
        testcase:
          "benchCppSoltp_Delete/01_02_t01: Table in Delta_ no merges_elapsed time",
        value: 5.585219198401218,
      },
      {
        testcase:
          "benchCppSoltp_Select/05_03_t05: resultset has one row_ 100 threads (all same workload)_elapsed time",
        value: 5.53717511803447,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_14_t02: Table in Main_ no merges_elapsed time",
        value: 5.529079071398799,
      },
      {
        testcase:
          "benchCppSoltp_Select/05_08_t05: resultset has one row_ 100 threads (all same workload)_elapsed time",
        value: 5.45849178997333,
      },
      {
        testcase:
          "benchCppSoltp_Insert/00_10_t00: Main (regular merges)_elapsed time",
        value: 5.454707799455263,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q32_SF10_TPCDS_Q32_elapsed time / query",
        value: 5.375667918567334,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q55_SF10_TPCDS_Q55_cpu time",
        value: 5.318549855459419,
      },
      {
        testcase:
          "benchCppSoltp_Update/00_00_t00: Table in Main_ regularly merged_elapsed time",
        value: 5.285047518218449,
      },
      {
        testcase:
          "benchCppSoltp_Insert/00_13_t00: Main (regular merges)_cpu time",
        value: 5.277181261568432,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q43_SF10_TPCDS_Q43_elapsed time / query",
        value: 5.270206632247283,
      },
      {
        testcase:
          "benchCppSoltp_Select/02_A00_t02: empty resultset_ 100 threads (all same workload)_elapsed time",
        value: 5.219529753265587,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q88_SF10_TPCDS_Q88_cpu time",
        value: 5.21260705810612,
      },
      {
        testcase:
          "benchCppSoltp_Delete/00_06_t00: Table in Main_ regularly merged_elapsed time",
        value: 5.207136237256691,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_05_t02: Table in Main_ no merges_cpu time",
        value: 5.004334622735734,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q08_SF10_TPCDS_Q08_elapsed time / query",
        value: 5.004159618178394,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q98_SF10_TPCDS_Q98_elapsed time / query",
        value: 4.983721214474916,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q05_SF10_TPCDS_Q05_cpu time",
        value: 4.861061000573105,
      },
      {
        testcase:
          "benchTPCDSloadperformance/TPCDSTest_SF1streams16_numstreams=16_scalefactor=1_power_cpu time",
        value: 4.7609091530621965,
      },
      {
        testcase:
          "benchCppSoltp_Delete/02_02_t02: Table in Main_ no merges_elapsed time",
        value: 4.759931152005119,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q52_SF10_TPCDS_Q52_cpu time",
        value: 4.745594192045734,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_01_t02: Table in Main_ no merges_elapsed time",
        value: 4.658327077837275,
      },
      {
        testcase:
          "benchCppSoltp_Select/02_A01_t02: empty resultset_ 100 threads (all same workload)_elapsed time",
        value: 4.587099739543387,
      },
      {
        testcase: "benchCppSoltp_Insert/02_10_t02: Row Store_elapsed time",
        value: 4.586365252214532,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q73_SF10_TPCDS_Q73_cpu time",
        value: 4.582668005207037,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q24_SF10_TPCDS_Q24_cpu time",
        value: 4.566424036017759,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q24b_SF10_TPCDS_Q24b_cpu time",
        value: 4.542862620744396,
      },
      {
        testcase: "benchCppSoltp_Insert/02_14_t02: Row Store_elapsed time",
        value: 4.539267240475638,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_13_t02: Table in Main_ no merges_cpu time",
        value: 4.533376017674118,
      },
      {
        testcase:
          "benchTPCDSloadperformance/TPCDSTest_SF1streams32_numstreams=32_scalefactor=1_power_cpu time",
        value: 4.517753949101325,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q88_SF10_TPCDS_Q88_elapsed time / query",
        value: 4.43555329098358,
      },
      {
        testcase:
          "benchCppSoltp_Insert/01_A01_t01: Delta (no merges)_elapsed time",
        value: 4.423174410731423,
      },
      {
        testcase: "benchCppSoltp_Insert/02_14_t02: Row Store_cpu time",
        value: 4.350678431145878,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q99_SF10_TPCDS_Q99_cpu time",
        value: 4.34156120435323,
      },
      {
        testcase:
          "benchCppSoltp_Select/02_04_t02: empty resultset_ 100 threads (all same workload)_elapsed time",
        value: 4.32034747013926,
      },
      {
        testcase:
          "benchCppSoltp_Delete/02_01_t02: Table in Main_ no merges_elapsed time",
        value: 4.304730868837379,
      },
      {
        testcase:
          "benchCppSoltp_Select/02_08_t02: empty resultset_ 100 threads (all same workload)_elapsed time",
        value: 4.278513909944726,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q59_SF10_TPCDS_Q59_elapsed time / query",
        value: 4.080515417139471,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q81_SF10_TPCDS_Q81_elapsed time / query",
        value: 4.079609997212127,
      },
      {
        testcase: "benchCppSoltp_Update/03_14_t03: Row Store_cpu time",
        value: 4.048179832080798,
      },
      {
        testcase:
          "benchCppSoltp_Delete/00_00_t00: Table in Main_ regularly merged_elapsed time",
        value: 3.9927229371376125,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q34_SF10_TPCDS_Q34_elapsed time / query",
        value: 3.921890472667008,
      },
      {
        testcase:
          "benchCppSoltp_Insert/00_A01_t00: Main (regular merges)_elapsed time",
        value: 3.828212341827739,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q19_SF10_TPCDS_Q19_cpu time",
        value: 3.8271441938148514,
      },
      {
        testcase:
          "benchCppSoltp_Delete/00_00_t00: Table in Main_ regularly merged_cpu time",
        value: 3.7534105395751625,
      },
      {
        testcase:
          "benchCppSoltp_Insert/01_13_t01: Delta (no merges)_elapsed time",
        value: 3.7477002635373484,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q10_SF10_TPCDS_Q10_elapsed time / query",
        value: 3.7333555158958207,
      },
      {
        testcase:
          "benchCppSoltp_Delete/02_04_t02: Table in Main_ no merges_cpu time",
        value: 3.630669271200305,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_03_t02: Table in Main_ no merges_cpu time",
        value: 3.60204596285105,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q77_SF10_TPCDS_Q77_cpu time",
        value: 3.595768102416298,
      },
      {
        testcase: "benchCppSoltp_Update/03_10_t03: Row Store_elapsed time",
        value: 3.577867976928015,
      },
      {
        testcase:
          "benchCppSoltp_Delete/02_05_t02: Table in Main_ no merges_cpu time",
        value: 3.530039260143895,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_10_t01: Table in Delta_ no merges_elapsed time",
        value: 3.522390046649471,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q05_SF10_TPCDS_Q05_elapsed time / query",
        value: 3.466062458178601,
      },
      {
        testcase:
          "benchTPCDSloadperformance/TPCDSTest_SF1streams32_numstreams=32_scalefactor=1_throughput_elapsed time",
        value: 3.4277903755749164,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q39_SF10_TPCDS_Q39_cpu time",
        value: 3.3944932305159856,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q33_SF10_TPCDS_Q33_elapsed time / query",
        value: 3.356635636503568,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_12_t02: Table in Main_ no merges_cpu time",
        value: 3.3531076254424925,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q99_SF10_TPCDS_Q99_elapsed time / query",
        value: 3.3279182655545285,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q31_SF10_TPCDS_Q31_cpu time",
        value: 3.2827162143158994,
      },
      {
        testcase:
          "benchCppSoltp_Insert/00_13_t00: Main (regular merges)_elapsed time",
        value: 3.2351431199068648,
      },
      {
        testcase:
          "benchCppSoltp_Insert/01_09_t01: Delta (no merges)_elapsed time",
        value: 3.225957924725577,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q45_SF10_TPCDS_Q45_cpu time",
        value: 3.22387285262615,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q50_SF10_TPCDS_Q50_cpu time",
        value: 3.1958674187088567,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_04_t02: Table in Main_ no merges_cpu time",
        value: 3.1481895021641932,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q62_SF10_TPCDS_Q62_elapsed time / query",
        value: 3.1475399049592285,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_03_t01: Table in Delta_ no merges_cpu time",
        value: 3.1414788740751014,
      },
      {
        testcase:
          "benchCppSoltp_Delete/02_03_t02: Table in Main_ no merges_cpu time",
        value: 3.127041123044227,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_05_t02: Table in Main_ no merges_elapsed time",
        value: 3.121464915020193,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q12_SF10_TPCDS_Q12_elapsed time / query",
        value: 3.120011200357332,
      },
      {
        testcase:
          "benchCppSoltp_Update/00_05_t00: Table in Main_ regularly merged_cpu time",
        value: 3.094184000469054,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q78_SF10_TPCDS_Q78_cpu time",
        value: 3.0928137152325283,
      },
      {
        testcase: "benchCppSoltp_Update/03_11_t03: Row Store_elapsed time",
        value: 3.0579272309445553,
      },
      {
        testcase:
          "benchCppSoltp_Update/00_13_t00: Table in Main_ regularly merged_cpu time",
        value: 3.039117082394778,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q41_SF10_TPCDS_Q41_elapsed time / query",
        value: 3.008633669738113,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_13_t01: Table in Delta_ no merges_cpu time",
        value: 3.0076697677977284,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_14_t01: Table in Delta_ no merges_cpu time",
        value: 2.979470439062603,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_10_t02: Table in Main_ no merges_elapsed time",
        value: 2.972310373362711,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_04_t01: Table in Delta_ no merges_cpu time",
        value: 2.9645541438435927,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q70_SF10_TPCDS_Q70_elapsed time / query",
        value: 2.9210249982508842,
      },
      {
        testcase:
          "benchCppSoltp_Insert/01_A00_t01: Delta (no merges)_elapsed time",
        value: 2.904072429600891,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_11_t02: Table in Main_ no merges_elapsed time",
        value: 2.8935933265433365,
      },
      {
        testcase:
          "benchCppSoltp_Update/00_10_t00: Table in Main_ regularly merged_elapsed time",
        value: 2.8848457268117045,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q07_SF10_TPCDS_Q07_cpu time",
        value: 2.845522265517172,
      },
      {
        testcase:
          "benchCppSoltp_Delete/00_01_t00: Table in Main_ regularly merged_elapsed time",
        value: 2.839450020764039,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_06_t01: Table in Delta_ no merges_elapsed time",
        value: 2.8281800232051295,
      },
      {
        testcase:
          "benchCppSoltp_Delete/00_02_t00: Table in Main_ regularly merged_elapsed time",
        value: 2.822337901483722,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_14_t01: Table in Delta_ no merges_elapsed time",
        value: 2.8060794513383063,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q85_SF10_TPCDS_Q85_elapsed time / query",
        value: 2.7783825356156737,
      },
      {
        testcase:
          "benchTPCDSloadperformance/TPCDSTest_SF1streams32_numstreams=32_scalefactor=1_throughput_cpu time",
        value: 2.7581085018444997,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q27_SF10_TPCDS_Q27_elapsed time / query",
        value: 2.744131874768312,
      },
      {
        testcase:
          "benchCppSoltp_Insert/00_12_t00: Main (regular merges)_cpu time",
        value: 2.7420149049386513,
      },
      {
        testcase:
          "benchCppSoltp_Insert/00_A00_t00: Main (regular merges)_cpu time",
        value: 2.7321176840875157,
      },
      {
        testcase: "benchCppSoltp_Insert/01_12_t01: Delta (no merges)_cpu time",
        value: 2.6190625795145843,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_12_t01: Table in Delta_ no merges_cpu time",
        value: 2.6167463162195315,
      },
      {
        testcase:
          "benchCppSoltp_Delete/01_04_t01: Table in Delta_ no merges_cpu time",
        value: 2.598518287832547,
      },
      {
        testcase:
          "benchCppSoltp_Update/00_03_t00: Table in Main_ regularly merged_cpu time",
        value: 2.5816983771991726,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q18_SF10_TPCDS_Q18_cpu time",
        value: 2.571898565063748,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q77_SF10_TPCDS_Q77_elapsed time / query",
        value: 2.544878410203575,
      },
      {
        testcase:
          "benchCppSoltp_Update/00_01_t00: Table in Main_ regularly merged_elapsed time",
        value: 2.541464949497411,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q86_SF10_TPCDS_Q86_elapsed time / query",
        value: 2.5047981528200753,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q35_SF10_TPCDS_Q35_cpu time",
        value: 2.491104828783013,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q87_SF10_TPCDS_Q87_elapsed time / query",
        value: 2.4717620672843763,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q70_SF10_TPCDS_Q70_cpu time",
        value: 2.4579985517823677,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q39_SF10_TPCDS_Q39_elapsed time / query",
        value: 2.432940038649144,
      },
      {
        testcase:
          "benchTPCDSloadperformance/TPCDSTest_SF1streams16_numstreams=16_scalefactor=1_throughput_cpu time",
        value: 2.4286553027285045,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q06_SF10_TPCDS_Q06_cpu time",
        value: 2.4073910883950953,
      },
      {
        testcase:
          "benchCppSoltp_Insert/00_09_t00: Main (regular merges)_elapsed time",
        value: 2.4016275710536794,
      },
      {
        testcase: "benchCppSoltp_Insert/02_A00_t02: Row Store_elapsed time",
        value: 2.38983538802307,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q46_SF10_TPCDS_Q46_cpu time",
        value: 2.3746175523594375,
      },
      {
        testcase:
          "benchCppSoltp_Update/00_13_t00: Table in Main_ regularly merged_elapsed time",
        value: 2.318469668385489,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q79_SF10_TPCDS_Q79_cpu time",
        value: 2.3017285383094337,
      },
      {
        testcase:
          "benchCppSoltp_Delete/01_05_t01: Table in Delta_ no merges_cpu time",
        value: 2.301435273179364,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q38_SF10_TPCDS_Q38_cpu time",
        value: 2.293128439736068,
      },
      {
        testcase:
          "benchCppSoltp_Delete/01_03_t01: Table in Delta_ no merges_cpu time",
        value: 2.2567332288651487,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_11_t02: Table in Main_ no merges_cpu time",
        value: 2.2317682317682754,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q60_SF10_TPCDS_Q60_cpu time",
        value: 2.228395050622911,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q97_SF10_TPCDS_Q97_cpu time",
        value: 2.2263291389242816,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q38_SF10_TPCDS_Q38_elapsed time / query",
        value: 2.188968402859304,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q13_SF10_TPCDS_Q13_elapsed time / query",
        value: 2.140201797806383,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q27_SF10_TPCDS_Q27_cpu time",
        value: 2.116568532116223,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q68_SF10_TPCDS_Q68_cpu time",
        value: 2.1015334414464157,
      },
      {
        testcase:
          "benchTPCDSloadperformance/TPCDSTest_SF1streams16_numstreams=16_scalefactor=1_throughput_elapsed time",
        value: 2.086098938809976,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q22_SF10_TPCDS_Q22_cpu time",
        value: 2.083965384628048,
      },
      {
        testcase:
          "benchCppSoltp_Insert/01_10_t01: Delta (no merges)_elapsed time",
        value: 2.0051092552518264,
      },
      {
        testcase:
          "benchCppSoltp_Update/00_12_t00: Table in Main_ regularly merged_cpu time",
        value: 2.000098331122936,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q80_SF10_TPCDS_Q80_cpu time",
        value: 1.942297664983574,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q56_SF10_TPCDS_Q56_cpu time",
        value: 1.9163474362116655,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_13_t02: Table in Main_ no merges_elapsed time",
        value: 1.9102298285914139,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q82_SF10_TPCDS_Q82_cpu time",
        value: 1.8776949603915654,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q20_SF10_TPCDS_Q20_elapsed time / query",
        value: 1.8767741342708344,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_12_t02: Table in Main_ no merges_elapsed time",
        value: 1.7003919890578576,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q66_SF10_TPCDS_Q66_cpu time",
        value: 1.6391115679627404,
      },
      {
        testcase:
          "benchCppSoltp_Delete/00_03_t00: Table in Main_ regularly merged_cpu time",
        value: 1.6352186130674702,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q65_SF10_TPCDS_Q65_cpu time",
        value: 1.6122993203314597,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q67_SF10_TPCDS_Q67_cpu time",
        value: 1.6022187397813417,
      },
      {
        testcase: "benchCppSoltp_Delete/03_02_t03: Row Store_elapsed time",
        value: 1.5563268230499594,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q36_SF10_TPCDS_Q36_elapsed time / query",
        value: 1.5527911946733137,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_03_t02: Table in Main_ no merges_elapsed time",
        value: 1.547591564731205,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_03_t01: Table in Delta_ no merges_elapsed time",
        value: 1.534910058776988,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q36_SF10_TPCDS_Q36_cpu time",
        value: 1.5103475776608741,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q14_SF10_TPCDS_Q14_cpu time",
        value: 1.452767953857984,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q01_SF10_TPCDS_Q01_cpu time",
        value: 1.4015144116008011,
      },
      {
        testcase: "benchCppSoltp_Insert/01_17_t01: Delta (no merges)_cpu time",
        value: 1.3832738509106803,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_04_t01: Table in Delta_ no merges_elapsed time",
        value: 1.3794273596867357,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_12_t01: Table in Delta_ no merges_elapsed time",
        value: 1.3783366741981935,
      },
      {
        testcase:
          "benchCppSoltp_Update/00_04_t00: Table in Main_ regularly merged_cpu time",
        value: 1.3755490565824513,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q71_SF10_TPCDS_Q71_cpu time",
        value: 1.3508158203365372,
      },
      {
        testcase:
          "benchCppSoltp_Update/00_01_t00: Table in Main_ regularly merged_cpu time",
        value: 1.3235156331810176,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q31_SF10_TPCDS_Q31_elapsed time / query",
        value: 1.3025653018207695,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_05_t01: Table in Delta_ no merges_elapsed time",
        value: 1.2742203159686531,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_05_t01: Table in Delta_ no merges_cpu time",
        value: 1.2724916334290008,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_13_t01: Table in Delta_ no merges_elapsed time",
        value: 1.2679376559174746,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q76_SF10_TPCDS_Q76_elapsed time / query",
        value: 1.166811397694431,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_17_t02: Table in Main_ no merges_cpu time",
        value: 1.154144881967232,
      },
      {
        testcase:
          "benchCppSoltp_Select/03_02_t03: resultset has one row_ 1 thread (all same workload)_cpu time",
        value: 1.1511518979997062,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q87_SF10_TPCDS_Q87_cpu time",
        value: 1.1158043359347476,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q86_SF10_TPCDS_Q86_cpu time",
        value: 1.0953183313918982,
      },
      {
        testcase:
          "benchCppSoltp_Select/02_07_t02: empty resultset_ 100 threads (all same workload)_elapsed time",
        value: 1.0755413421042772,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q48_SF10_TPCDS_Q48_elapsed time / query",
        value: 1.066949129989274,
      },
      {
        testcase:
          "benchCppSoltp_Update/00_04_t00: Table in Main_ regularly merged_elapsed time",
        value: 0.9777456560363025,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q75_SF10_TPCDS_Q75_cpu time",
        value: 0.9662666580782413,
      },
      {
        testcase:
          "benchCppSoltp_Delete/02_05_t02: Table in Main_ no merges_elapsed time",
        value: 0.9521478399216442,
      },
      {
        testcase:
          "benchTPCHloadperformance/TPCHTest_SF10streams10_numstreams=10_scalefactor=10_throughput_cpu time",
        value: 0.915647841551701,
      },
      {
        testcase:
          "benchCppSoltp_Delete/01_04_t01: Table in Delta_ no merges_elapsed time",
        value: 0.890230900673282,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q76_SF10_TPCDS_Q76_cpu time",
        value: 0.8866485350608432,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q18_SF10_TPCDS_Q18_elapsed time / query",
        value: 0.8852824416221208,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q03_SF10_TPCDS_Q03_elapsed time / query",
        value: 0.8676898061328763,
      },
      {
        testcase:
          "benchCppSoltp_Delete/01_05_t01: Table in Delta_ no merges_elapsed time",
        value: 0.8635768260201762,
      },
      {
        testcase:
          "benchTPCDSloadperformance/TPCDSTest_SF1streams16_numstreams=16_scalefactor=1_power_elapsed time",
        value: 0.7938257250384877,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q28_SF10_TPCDS_Q28_elapsed time / query",
        value: 0.7924575041775161,
      },
      {
        testcase:
          "benchCppSoltp_Insert/00_12_t00: Main (regular merges)_elapsed time",
        value: 0.7773607599871064,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q66_SF10_TPCDS_Q66_elapsed time / query",
        value: 0.7298800466815183,
      },
      {
        testcase:
          "benchTPCHloadperformance/TPCHTest_SF10streams20_numstreams=20_scalefactor=10_throughput_cpu time",
        value: 0.6524930314150348,
      },
      {
        testcase:
          "benchCppSoltp_Delete/00_04_t00: Table in Main_ regularly merged_cpu time",
        value: 0.6513582807573506,
      },
      {
        testcase:
          "benchTPCHloadperformance/TPCHTest_SF10streams40_numstreams=40_scalefactor=10_throughput_cpu time",
        value: 0.648558120402973,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q67_SF10_TPCDS_Q67_elapsed time / query",
        value: 0.6301400533887871,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q17_SF10_TPCDS_Q17_cpu time",
        value: 0.6108671677167719,
      },
      {
        testcase:
          "benchCppSoltp_Delete/01_03_t01: Table in Delta_ no merges_elapsed time",
        value: 0.6017839648074033,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q14_SF10_TPCDS_Q14_elapsed time / query",
        value: 0.582659855049057,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_04_t02: Table in Main_ no merges_elapsed time",
        value: 0.5715212826875458,
      },
      {
        testcase: "benchCppSoltp_Update/03_14_t03: Row Store_elapsed time",
        value: 0.5057298204477273,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q55_SF10_TPCDS_Q55_elapsed time / query",
        value: 0.5016473213633487,
      },
      {
        testcase:
          "benchCppSoltp_Delete/02_04_t02: Table in Main_ no merges_elapsed time",
        value: 0.48795821002072315,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q29_SF10_TPCDS_Q29_elapsed time / query",
        value: 0.43146686702872566,
      },
      {
        testcase:
          "benchCppSoltp_Delete/02_03_t02: Table in Main_ no merges_elapsed time",
        value: 0.42748859174596254,
      },
      {
        testcase:
          "benchCppSoltp_Delete/00_07_t00: Table in Main_ regularly merged_elapsed time",
        value: 0.42112710144653376,
      },
      {
        testcase:
          "benchVdmSingleQueries/Query04_Default_Query 04_cpu-service-time-avg",
        value: 0.3846851554395538,
      },
      {
        testcase:
          "benchTPCHloadperformance/TPCHTest_SF10streams20_numstreams=20_scalefactor=10_throughput_elapsed time",
        value: 0.34084786079299195,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/00_00_t00: JoinEngine_ 1 thread x 5k reps_cpu time",
        value: 0.32051850588430236,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q74_SF10_TPCDS_Q74_cpu time",
        value: 0.2970657581472097,
      },
      {
        testcase:
          "benchTPCHloadperformance/TPCHTest_SF10streams10_numstreams=10_scalefactor=10_throughput_elapsed time",
        value: 0.29553842772263755,
      },
      {
        testcase:
          "benchCppSoltp_Insert/01_12_t01: Delta (no merges)_elapsed time",
        value: 0.28202370949557964,
      },
      {
        testcase:
          "benchTPCHloadperformance/TPCHTest_SF10streams40_numstreams=40_scalefactor=10_throughput_elapsed time",
        value: 0.25906904358732924,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q82_SF10_TPCDS_Q82_elapsed time / query",
        value: 0.23783846997711916,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q24b_SF10_TPCDS_Q24b_elapsed time / query",
        value: 0.19403299584996883,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q65_SF10_TPCDS_Q65_elapsed time / query",
        value: 0.18988744677237004,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q95_SF10_TPCDS_Q95_elapsed time / query",
        value: 0.147659971710072,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q16_SF10_TPCDS_Q16_elapsed time / query",
        value: 0.12494609049232656,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q24_SF10_TPCDS_Q24_elapsed time / query",
        value: 0.11809585815233879,
      },
      {
        testcase:
          "benchCppSoltp_Select/02_06_t02: empty resultset_ 100 threads (all same workload)_elapsed time",
        value: 0.1118441253919864,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q75_SF10_TPCDS_Q75_elapsed time / query",
        value: 0.08401221656058218,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q23b_SF10_TPCDS_Q23b_elapsed time / query",
        value: 0.05004137130733255,
      },
      {
        testcase: "benchCppSoltp_Insert/02_12_t02: Row Store_cpu time",
        value: 0.04689959022820839,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q80_SF10_TPCDS_Q80_elapsed time / query",
        value: -0.03167210211675224,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q46_SF10_TPCDS_Q46_elapsed time / query",
        value: -0.06174238900709468,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q23_SF10_TPCDS_Q23_elapsed time / query",
        value: -0.09976987135782367,
      },
      {
        testcase:
          "benchTPCDSloadperformance/TPCDSTest_SF1streams32_numstreams=32_scalefactor=1_power_elapsed time",
        value: -0.1280712304412341,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q09_SF10_TPCDS_Q09_elapsed time / query",
        value: -0.13527823747396597,
      },
      {
        testcase:
          "benchVdmSingleQueries/Query03_Default_Query 03_cpu-service-time-avg",
        value: -0.1796236325648181,
      },
      {
        testcase:
          "benchCppSoltp_Update/00_12_t00: Table in Main_ regularly merged_elapsed time",
        value: -0.1835120675306419,
      },
      {
        testcase: "benchCppSoltp_Insert/02_13_t02: Row Store_cpu time",
        value: -0.20884516021250907,
      },
      {
        testcase:
          "benchCppSoltp_Select/04_02_t04: resultset has one row_ 10 threads (all same workload)_cpu time",
        value: -0.31013013864186023,
      },
      {
        testcase:
          "benchCppSoltp_Delete/00_05_t00: Table in Main_ regularly merged_elapsed time",
        value: -0.3121530218914072,
      },
      {
        testcase: "benchCppSoltp_Delete/03_05_t03: Row Store_cpu time",
        value: -0.3183916952372958,
      },
      {
        testcase: "benchCppSoltp_Insert/02_A01_t02: Row Store_cpu time",
        value: -0.3184132351130312,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q23_SF10_TPCDS_Q23_cpu time",
        value: -0.3274279141423493,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q06_SF10_TPCDS_Q06_elapsed time / query",
        value: -0.35267062768288443,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q04_SF10_TPCDS_Q04_cpu time",
        value: -0.3639907481744095,
      },
      {
        testcase:
          "benchVdmSingleQueries/Query01_Default_Query 01_elapsed time avg",
        value: -0.3676600823429004,
      },
      {
        testcase:
          "benchCppSoltp_Select/03_02_t03: resultset has one row_ 1 thread (all same workload)_elapsed time",
        value: -0.4144591241365348,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q09_SF10_TPCDS_Q09_cpu time",
        value: -0.4285342979896358,
      },
      {
        testcase:
          "benchCppSoltp_Update/00_10_t00: Table in Main_ regularly merged_cpu time",
        value: -0.43234822364000425,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q37_SF10_TPCDS_Q37_cpu time",
        value: -0.4475521628817999,
      },
      {
        testcase:
          "benchCppSoltp_Update/00_03_t00: Table in Main_ regularly merged_elapsed time",
        value: -0.44759173410860575,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q23b_SF10_TPCDS_Q23b_cpu time",
        value: -0.4519210847688949,
      },
      {
        testcase:
          "benchCppSoltp_Delete/00_04_t00: Table in Main_ regularly merged_elapsed time",
        value: -0.4566435336964218,
      },
      {
        testcase:
          "benchCppSoltp_Select/04_02_t04: resultset has one row_ 10 threads (all same workload)_elapsed time",
        value: -0.5342066744804908,
      },
      {
        testcase: "benchCppSoltp_Delete/03_04_t03: Row Store_cpu time",
        value: -0.6119115412303224,
      },
      {
        testcase: "benchCppSoltp_Update/03_12_t03: Row Store_cpu time",
        value: -0.6764078770026681,
      },
      {
        testcase: "benchCppSoltp_Update/03_13_t03: Row Store_cpu time",
        value: -0.7245427692877687,
      },
      {
        testcase: "benchCppSoltp_Update/03_03_t03: Row Store_cpu time",
        value: -0.7658898344689897,
      },
      {
        testcase: "benchCppSoltp_Update/03_04_t03: Row Store_cpu time",
        value: -0.7774747642960548,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/00_02_t00: JoinEngine_ 1 thread x 5k reps_cpu time",
        value: -0.7927062291859788,
      },
      {
        testcase:
          "benchCppSoltp_Update/00_11_t00: Table in Main_ regularly merged_cpu time",
        value: -0.8320936051847437,
      },
      {
        testcase: "benchCppSoltp_Update/03_05_t03: Row Store_cpu time",
        value: -0.8511624117956044,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/00_01_t00: JoinEngine_ 1 thread x 5k reps_cpu time",
        value: -0.8539141020420988,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q30_SF10_TPCDS_Q30_elapsed time / query",
        value: -0.8654479767900354,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q97_SF10_TPCDS_Q97_elapsed time / query",
        value: -0.8905512324066426,
      },
      {
        testcase: "benchCppSoltp_Delete/03_03_t03: Row Store_cpu time",
        value: -0.8914207609305406,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q49_SF10_TPCDS_Q49_elapsed time / query",
        value: -0.9022056323571982,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q56_SF10_TPCDS_Q56_elapsed time / query",
        value: -0.9063404468857171,
      },
      {
        testcase: "benchCppSoltp_Insert/02_12_t02: Row Store_elapsed time",
        value: -0.9204219509304079,
      },
      {
        testcase: "benchCppSoltp_Insert/02_A01_t02: Row Store_elapsed time",
        value: -0.9375463287836545,
      },
      {
        testcase: "benchCppSoltp_Update/03_12_t03: Row Store_elapsed time",
        value: -0.9574369470312697,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q50_SF10_TPCDS_Q50_elapsed time / query",
        value: -0.9668649389537941,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q11_SF10_TPCDS_Q11_cpu time",
        value: -1.0410455581949,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/01_00_t01: JoinEngine_ 10 threads x 5k reps_cpu time",
        value: -1.0465217659921098,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q71_SF10_TPCDS_Q71_elapsed time / query",
        value: -1.0836289135709885,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q52_SF10_TPCDS_Q52_elapsed time / query",
        value: -1.1541255109153652,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q22_SF10_TPCDS_Q22_elapsed time / query",
        value: -1.1707464256542164,
      },
      {
        testcase:
          "benchCppSoltp_Select/04_01_t04: resultset has one row_ 10 threads (all same workload)_cpu time",
        value: -1.2041562990540002,
      },
      {
        testcase:
          "benchCppSoltp_Delete/00_03_t00: Table in Main_ regularly merged_elapsed time",
        value: -1.2124671640404434,
      },
      {
        testcase: "benchCppSoltp_Delete/03_05_t03: Row Store_elapsed time",
        value: -1.2350314352761282,
      },
      {
        testcase: "benchCppSoltp_Insert/02_13_t02: Row Store_elapsed time",
        value: -1.2370651050637105,
      },
      {
        testcase: "benchCppSoltp_Update/03_05_t03: Row Store_elapsed time",
        value: -1.2747956947953485,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/03_03_t03: P*Time_ 1 thread x 5k reps_cpu time",
        value: -1.2774599599851086,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q58_SF10_TPCDS_Q58_elapsed time / query",
        value: -1.306680152653946,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/03_00_t03: P*Time_ 1 thread x 5k reps_cpu time",
        value: -1.3271202643219802,
      },
      {
        testcase: "benchCppSoltp_Delete/03_04_t03: Row Store_elapsed time",
        value: -1.3480679357744034,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/03_02_t03: P*Time_ 1 thread x 5k reps_cpu time",
        value: -1.3627141509582965,
      },
      {
        testcase:
          "benchCppSoltp_Select/03_01_t03: resultset has one row_ 1 thread (all same workload)_cpu time",
        value: -1.3765182186234943,
      },
      {
        testcase:
          "benchVdmSingleQueries/Query01_Default_Query 01_cpu-service-time-avg",
        value: -1.40789739168398,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/00_00_t00: JoinEngine_ 1 thread x 5k reps_elapsed time",
        value: -1.4358013120899396,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/03_01_t03: P*Time_ 1 thread x 5k reps_cpu time",
        value: -1.441840037737696,
      },
      {
        testcase:
          "benchCppSoltp_Select/03_A00_t03: resultset has one row_ 1 thread (all same workload)_cpu time",
        value: -1.4580824258522531,
      },
      {
        testcase:
          "benchCppSoltp_Delete/00_01_t00: Table in Main_ regularly merged_cpu time",
        value: -1.47785990041041,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q37_SF10_TPCDS_Q37_elapsed time / query",
        value: -1.4811743081661626,
      },
      {
        testcase:
          "benchCppSoltp_Select/04_05_t04: resultset has one row_ 10 threads (all same workload)_cpu time",
        value: -1.5527863574975969,
      },
      {
        testcase: "benchCppSoltp_Update/03_13_t03: Row Store_elapsed time",
        value: -1.5777802121669389,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q01_SF10_TPCDS_Q01_elapsed time / query",
        value: -1.5781852818046078,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q60_SF10_TPCDS_Q60_elapsed time / query",
        value: -1.5838072095382256,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/04_02_t04: P*Time_ 10 threads x 5k reps_cpu time",
        value: -1.629311383433445,
      },
      {
        testcase:
          "benchTPCDSloadperformance/TPCDSTest_SF1streams16_numstreams=16_scalefactor=1_binary_cpu time",
        value: -1.6519389797684854,
      },
      {
        testcase:
          "benchCppSoltp_Select/04_05_t04: resultset has one row_ 10 threads (all same workload)_elapsed time",
        value: -1.6638165708847539,
      },
      {
        testcase:
          "benchCppSoltp_Delete/00_05_t00: Table in Main_ regularly merged_cpu time",
        value: -1.66930237559535,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q04_SF10_TPCDS_Q04_elapsed time / query",
        value: -1.700419310405586,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/01_02_t01: JoinEngine_ 10 threads x 5k reps_cpu time",
        value: -1.7217953016368643,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q25_SF10_TPCDS_Q25_elapsed time / query",
        value: -1.7522432182406256,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/01_01_t01: JoinEngine_ 10 threads x 5k reps_cpu time",
        value: -1.7629059393687092,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q28_SF10_TPCDS_Q28_cpu time",
        value: -1.7787895598910322,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q69_SF10_TPCDS_Q69_elapsed time / query",
        value: -1.7862412713099203,
      },
      {
        testcase: "benchCppSoltp_Update/03_03_t03: Row Store_elapsed time",
        value: -1.8365663208849332,
      },
      {
        testcase:
          "benchCppSoltp_Select/03_08_t03: resultset has one row_ 1 thread (all same workload)_cpu time",
        value: -1.8519153961863102,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q73_SF10_TPCDS_Q73_elapsed time / query",
        value: -1.880612304450969,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q72_SF10_TPCDS_Q72_cpu time",
        value: -1.899112334920572,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/04_00_t04: P*Time_ 10 threads x 5k reps_cpu time",
        value: -1.9009441977362433,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/04_01_t04: P*Time_ 10 threads x 5k reps_cpu time",
        value: -1.9031984997686429,
      },
      {
        testcase: "benchCppSoltp_Delete/03_03_t03: Row Store_elapsed time",
        value: -1.903936803004862,
      },
      {
        testcase: "benchCppSoltp_Update/03_04_t03: Row Store_elapsed time",
        value: -1.9693586265987582,
      },
      {
        testcase:
          "benchCppSoltp_Select/04_A01_t04: resultset has one row_ 10 threads (all same workload)_cpu time",
        value: -2.117071823548548,
      },
      {
        testcase:
          "benchCppSoltp_Select/04_04_t04: resultset has one row_ 10 threads (all same workload)_cpu time",
        value: -2.1265244141261923,
      },
      {
        testcase:
          "benchCppSoltp_Select/03_04_t03: resultset has one row_ 1 thread (all same workload)_cpu time",
        value: -2.1306288532314146,
      },
      {
        testcase:
          "benchCppSoltp_Select/04_03_t04: resultset has one row_ 10 threads (all same workload)_cpu time",
        value: -2.1631496178942107,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/00_02_t00: JoinEngine_ 1 thread x 5k reps_elapsed time",
        value: -2.1840794556604544,
      },
      {
        testcase:
          "benchCppSoltp_Select/04_A00_t04: resultset has one row_ 10 threads (all same workload)_cpu time",
        value: -2.1910869451105257,
      },
      {
        testcase:
          "benchCppSoltp_Select/01_00_t01: empty resultset_ 10 threads (all same workload)_cpu time",
        value: -2.212974035009992,
      },
      {
        testcase:
          "benchCppSoltp_Select/04_06_t04: resultset has one row_ 10 threads (all same workload)_cpu time",
        value: -2.220342594276399,
      },
      {
        testcase:
          "benchCppSoltp_Select/04_00_t04: resultset has one row_ 10 threads (all same workload)_cpu time",
        value: -2.228569654580619,
      },
      {
        testcase:
          "benchCppSoltp_Select/04_A02_t04: resultset has one row_ 10 threads (all same workload)_cpu time",
        value: -2.2340209711168653,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q11_SF10_TPCDS_Q11_elapsed time / query",
        value: -2.255575248974725,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q19_SF10_TPCDS_Q19_elapsed time / query",
        value: -2.270346365595179,
      },
      {
        testcase:
          "benchCppSoltp_Update/00_05_t00: Table in Main_ regularly merged_elapsed time",
        value: -2.3150771934254015,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q79_SF10_TPCDS_Q79_elapsed time / query",
        value: -2.359528769503719,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q74_SF10_TPCDS_Q74_elapsed time / query",
        value: -2.377919137035463,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/05_05_t05: P*Time_ 100 threads x 10k reps_elapsed time",
        value: -2.414881184484166,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/04_03_t04: P*Time_ 10 threads x 5k reps_cpu time",
        value: -2.415868108895442,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/04_05_t04: P*Time_ 10 threads x 10k reps_cpu time",
        value: -2.4180400181621184,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/04_02_t04: P*Time_ 10 threads x 5k reps_elapsed time",
        value: -2.418087322863463,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/00_01_t00: JoinEngine_ 1 thread x 5k reps_elapsed time",
        value: -2.4317011570765454,
      },
      {
        testcase:
          "benchCppSoltp_Select/02_A02_t02: empty resultset_ 100 threads (all same workload)_elapsed time",
        value: -2.4515943330118195,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/03_04_t03: P*Time_ 1 thread x 5k reps_cpu time",
        value: -2.4531298198310956,
      },
      {
        testcase:
          "benchCppSoltp_Select/04_07_t04: resultset has one row_ 10 threads (all same workload)_cpu time",
        value: -2.490940777754137,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/01_01_t01: JoinEngine_ 10 threads x 5k reps_elapsed time",
        value: -2.5100674339362046,
      },
      {
        testcase:
          "benchCppSoltp_Select/03_A01_t03: resultset has one row_ 1 thread (all same workload)_cpu time",
        value: -2.5123422635753005,
      },
      {
        testcase:
          "benchCppSoltp_Select/01_02_t01: empty resultset_ 10 threads (all same workload)_cpu time",
        value: -2.513897714032653,
      },
      {
        testcase:
          "benchCppSoltp_Select/00_02_t00: empty resultset_ 1 thread (all same workload)_cpu time",
        value: -2.5188898975887497,
      },
      {
        testcase:
          "benchCppSoltp_Select/04_01_t04: resultset has one row_ 10 threads (all same workload)_elapsed time",
        value: -2.5227985237509487,
      },
      {
        testcase:
          "benchCppSoltp_Select/04_08_t04: resultset has one row_ 10 threads (all same workload)_cpu time",
        value: -2.5687419187168086,
      },
      {
        testcase:
          "benchCppSoltp_Select/03_05_t03: resultset has one row_ 1 thread (all same workload)_cpu time",
        value: -2.5721276131877064,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/01_02_t01: JoinEngine_ 10 threads x 5k reps_elapsed time",
        value: -2.578993043206106,
      },
      {
        testcase:
          "benchCppSoltp_Select/01_04_t01: empty resultset_ 10 threads (all same workload)_cpu time",
        value: -2.5821244639596315,
      },
      {
        testcase:
          "benchCppSoltp_Select/01_A01_t01: empty resultset_ 10 threads (all same workload)_cpu time",
        value: -2.6207035355902475,
      },
      {
        testcase:
          "benchCppSoltp_Select/03_A02_t03: resultset has one row_ 1 thread (all same workload)_cpu time",
        value: -2.651428759689957,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q72_SF10_TPCDS_Q72_elapsed time / query",
        value: -2.677562521850192,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q78_SF10_TPCDS_Q78_elapsed time / query",
        value: -2.6937188177834774,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/01_00_t01: JoinEngine_ 10 threads x 5k reps_elapsed time",
        value: -2.702957505499514,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/03_01_t03: P*Time_ 1 thread x 5k reps_elapsed time",
        value: -2.7742043957161338,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/03_03_t03: P*Time_ 1 thread x 5k reps_elapsed time",
        value: -2.783088081019637,
      },
      {
        testcase:
          "benchCppSoltp_Select/01_01_t01: empty resultset_ 10 threads (all same workload)_cpu time",
        value: -2.824519970218269,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/04_04_t04: P*Time_ 10 threads x 5k reps_cpu time",
        value: -2.8325112375773847,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q26_SF10_TPCDS_Q26_elapsed time / query",
        value: -2.8450137666369724,
      },
      {
        testcase:
          "benchCppSoltp_Select/01_08_t01: empty resultset_ 10 threads (all same workload)_cpu time",
        value: -2.8485014926607497,
      },
      {
        testcase:
          "benchCppSoltp_Select/01_06_t01: empty resultset_ 10 threads (all same workload)_cpu time",
        value: -2.8856698997708277,
      },
      {
        testcase:
          "benchCppSoltp_Select/01_05_t01: empty resultset_ 10 threads (all same workload)_cpu time",
        value: -2.9036408459339182,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/03_02_t03: P*Time_ 1 thread x 5k reps_elapsed time",
        value: -2.9548506959417513,
      },
      {
        testcase:
          "benchCppSoltp_Select/01_A02_t01: empty resultset_ 10 threads (all same workload)_cpu time",
        value: -2.977038090604092,
      },
      {
        testcase:
          "benchCppSoltp_Select/03_03_t03: resultset has one row_ 1 thread (all same workload)_cpu time",
        value: -2.9860129165833533,
      },
      {
        testcase:
          "benchCppSoltp_Delete/00_02_t00: Table in Main_ regularly merged_cpu time",
        value: -2.9884036892499495,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/03_05_t03: P*Time_ 1 thread x 10k reps_cpu time",
        value: -2.9894330189751313,
      },
      {
        testcase:
          "benchCppSoltp_Select/03_A00_t03: resultset has one row_ 1 thread (all same workload)_elapsed time",
        value: -2.992366449773859,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/04_01_t04: P*Time_ 10 threads x 5k reps_elapsed time",
        value: -3.034559485693708,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/04_03_t04: P*Time_ 10 threads x 5k reps_elapsed time",
        value: -3.036732427998111,
      },
      {
        testcase:
          "benchCppSoltp_Select/00_04_t00: empty resultset_ 1 thread (all same workload)_cpu time",
        value: -3.0465452688903882,
      },
      {
        testcase:
          "benchCppSoltp_Select/01_03_t01: empty resultset_ 10 threads (all same workload)_cpu time",
        value: -3.0523043977124096,
      },
      {
        testcase:
          "benchCppSoltp_Select/01_A00_t01: empty resultset_ 10 threads (all same workload)_cpu time",
        value: -3.076276427312209,
      },
      {
        testcase:
          "benchCppSoltp_Select/03_01_t03: resultset has one row_ 1 thread (all same workload)_elapsed time",
        value: -3.082795041497679,
      },
      {
        testcase:
          "benchCppSoltp_Select/00_01_t00: empty resultset_ 1 thread (all same workload)_cpu time",
        value: -3.0905292726537503,
      },
      {
        testcase:
          "benchCppSoltp_Select/01_07_t01: empty resultset_ 10 threads (all same workload)_cpu time",
        value: -3.0997281849085994,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/03_00_t03: P*Time_ 1 thread x 5k reps_elapsed time",
        value: -3.101683947257242,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/04_00_t04: P*Time_ 10 threads x 5k reps_elapsed time",
        value: -3.1949689348019423,
      },
      {
        testcase:
          "benchCppSoltp_Select/03_06_t03: resultset has one row_ 1 thread (all same workload)_cpu time",
        value: -3.261147373504445,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q93_SF10_TPCDS_Q93_elapsed time / query",
        value: -3.30187958251137,
      },
      {
        testcase:
          "benchVdmSingleQueries/Query03_Default_Query 03_elapsed time avg",
        value: -3.3071221200596352,
      },
      {
        testcase:
          "benchTPCDSloadperformance/TPCDSTest_SF1streams32_numstreams=32_scalefactor=1_binary_elapsed time",
        value: -3.330087633885104,
      },
      {
        testcase:
          "benchCppSoltp_Select/00_00_t00: empty resultset_ 1 thread (all same workload)_cpu time",
        value: -3.3490007744424055,
      },
      {
        testcase:
          "benchCppSoltp_Select/00_06_t00: empty resultset_ 1 thread (all same workload)_cpu time",
        value: -3.35708760108388,
      },
      {
        testcase:
          "benchCppSoltp_Select/00_A00_t00: empty resultset_ 1 thread (all same workload)_cpu time",
        value: -3.422228101902802,
      },
      {
        testcase:
          "benchCppSoltp_Select/03_07_t03: resultset has one row_ 1 thread (all same workload)_cpu time",
        value: -3.431019559474854,
      },
      {
        testcase:
          "benchVdmSingleQueries/Query02_Default_Query 02_elapsed time avg",
        value: -3.4500116563970864,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q45_SF10_TPCDS_Q45_elapsed time / query",
        value: -3.479239969938014,
      },
      {
        testcase:
          "benchCppSoltp_Select/01_A01_t01: empty resultset_ 10 threads (all same workload)_elapsed time",
        value: -3.6020742371285657,
      },
      {
        testcase:
          "benchCppSoltp_Select/03_08_t03: resultset has one row_ 1 thread (all same workload)_elapsed time",
        value: -3.634519233995789,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/04_04_t04: P*Time_ 10 threads x 5k reps_elapsed time",
        value: -3.6486142191823054,
      },
      {
        testcase:
          "benchCppSoltp_Select/03_00_t03: resultset has one row_ 1 thread (all same workload)_cpu time",
        value: -3.6707020654509894,
      },
      {
        testcase:
          "benchCppSoltp_Select/00_A01_t00: empty resultset_ 1 thread (all same workload)_cpu time",
        value: -3.6893132675373366,
      },
      {
        testcase:
          "benchCppSoltp_Select/00_07_t00: empty resultset_ 1 thread (all same workload)_cpu time",
        value: -3.745219475428392,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_06_t02: Table in Main_ no merges_cpu time",
        value: -3.779209157830737,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q07_SF10_TPCDS_Q07_elapsed time / query",
        value: -3.8076588366865365,
      },
      {
        testcase:
          "benchCppSoltp_Select/03_04_t03: resultset has one row_ 1 thread (all same workload)_elapsed time",
        value: -3.8352077485931355,
      },
      {
        testcase:
          "benchCppSoltp_Select/04_A01_t04: resultset has one row_ 10 threads (all same workload)_elapsed time",
        value: -3.869284002446262,
      },
      {
        testcase:
          "benchCppSoltp_Select/03_05_t03: resultset has one row_ 1 thread (all same workload)_elapsed time",
        value: -3.876305137444739,
      },
      {
        testcase:
          "benchCppSoltp_Select/00_02_t00: empty resultset_ 1 thread (all same workload)_elapsed time",
        value: -3.8856094635591796,
      },
      {
        testcase:
          "benchTPCDSloadperformance/TPCDSTest_SF1streams32_numstreams=32_scalefactor=1_binary_cpu time",
        value: -3.9187701939271764,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/03_04_t03: P*Time_ 1 thread x 5k reps_elapsed time",
        value: -3.921058852954995,
      },
      {
        testcase:
          "benchCppSoltp_Select/00_03_t00: empty resultset_ 1 thread (all same workload)_cpu time",
        value: -3.975785976539629,
      },
      {
        testcase:
          "benchCppSoltp_Select/04_A00_t04: resultset has one row_ 10 threads (all same workload)_elapsed time",
        value: -4.026871643586782,
      },
      {
        testcase: "benchCppSoltp_Insert/01_A02_t01: Delta (no merges)_cpu time",
        value: -4.054490798565344,
      },
      {
        testcase:
          "benchTPCDSloadperformance/TPCDSTest_SF1streams16_numstreams=16_scalefactor=1_binary_elapsed time",
        value: -4.0668573919404585,
      },
      {
        testcase:
          "benchCppSoltp_Select/01_02_t01: empty resultset_ 10 threads (all same workload)_elapsed time",
        value: -4.100548319933102,
      },
      {
        testcase:
          "benchCppSoltp_Select/03_A01_t03: resultset has one row_ 1 thread (all same workload)_elapsed time",
        value: -4.1012446131708025,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q68_SF10_TPCDS_Q68_elapsed time / query",
        value: -4.102327154325932,
      },
      {
        testcase:
          "benchCppSoltp_Select/00_05_t00: empty resultset_ 1 thread (all same workload)_cpu time",
        value: -4.150555438921192,
      },
      {
        testcase:
          "benchCppSoltp_Select/03_A02_t03: resultset has one row_ 1 thread (all same workload)_elapsed time",
        value: -4.235174860618356,
      },
      {
        testcase:
          "benchCppSoltp_Select/00_08_t00: empty resultset_ 1 thread (all same workload)_cpu time",
        value: -4.284229114624657,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_08_t02: Table in Main_ no merges_cpu time",
        value: -4.311855631841622,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_16_t02: Table in Main_ no merges_cpu time",
        value: -4.326699447981102,
      },
      {
        testcase:
          "benchCppSoltp_Select/04_04_t04: resultset has one row_ 10 threads (all same workload)_elapsed time",
        value: -4.367306961377712,
      },
      {
        testcase:
          "benchVdmSingleQueries/Query04_Default_Query 04_elapsed time avg",
        value: -4.391692202903265,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q35_SF10_TPCDS_Q35_elapsed time / query",
        value: -4.437327573255109,
      },
      {
        testcase:
          "benchCppSoltp_Select/00_04_t00: empty resultset_ 1 thread (all same workload)_elapsed time",
        value: -4.4680736630247555,
      },
      {
        testcase:
          "benchVdmSingleQueries/Query02_Default_Query 02_cpu-service-time-avg",
        value: -4.487393942201042,
      },
      {
        testcase:
          "benchCppSoltp_Select/00_01_t00: empty resultset_ 1 thread (all same workload)_elapsed time",
        value: -4.566045801337533,
      },
      {
        testcase:
          "benchCppSoltp_Select/00_06_t00: empty resultset_ 1 thread (all same workload)_elapsed time",
        value: -4.588458809494739,
      },
      {
        testcase:
          "benchCppSoltp_Select/03_06_t03: resultset has one row_ 1 thread (all same workload)_elapsed time",
        value: -4.605780614821541,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q17_SF10_TPCDS_Q17_elapsed time / query",
        value: -4.60948551417662,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q15_SF10_TPCDS_Q15_elapsed time / query",
        value: -4.703073294092504,
      },
      {
        testcase:
          "benchCppSoltp_Select/00_00_t00: empty resultset_ 1 thread (all same workload)_elapsed time",
        value: -4.703777176722734,
      },
      {
        testcase: "benchCppSoltp_Insert/01_16_t01: Delta (no merges)_cpu time",
        value: -4.726385090571348,
      },
      {
        testcase:
          "benchCppSoltp_Select/05_07_t05: resultset has one row_ 100 threads (all same workload)_elapsed time",
        value: -4.7429462562087155,
      },
      {
        testcase:
          "benchCppSoltp_Select/01_04_t01: empty resultset_ 10 threads (all same workload)_elapsed time",
        value: -4.761910865067217,
      },
      {
        testcase:
          "benchCppSoltp_Select/03_03_t03: resultset has one row_ 1 thread (all same workload)_elapsed time",
        value: -4.7832885865428985,
      },
      {
        testcase:
          "benchCppSoltp_Delete/00_06_t00: Table in Main_ regularly merged_cpu time",
        value: -4.818073709457246,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/03_05_t03: P*Time_ 1 thread x 10k reps_elapsed time",
        value: -4.871872173650902,
      },
      {
        testcase:
          "benchCppSoltp_Select/04_08_t04: resultset has one row_ 10 threads (all same workload)_elapsed time",
        value: -4.906359115437568,
      },
      {
        testcase:
          "benchCppSoltp_Select/01_08_t01: empty resultset_ 10 threads (all same workload)_elapsed time",
        value: -4.918086323925,
      },
      {
        testcase:
          "benchCppSoltp_Select/03_07_t03: resultset has one row_ 1 thread (all same workload)_elapsed time",
        value: -4.982444903054946,
      },
      {
        testcase: "benchTPCDS/TPCDS_Q40_SF10_TPCDS_Q40_elapsed time / query",
        value: -5.062953397616288,
      },
      {
        testcase:
          "benchCppSoltp_Select/00_A00_t00: empty resultset_ 1 thread (all same workload)_elapsed time",
        value: -5.08855371747448,
      },
      {
        testcase:
          "benchCppSoltp_Select/04_03_t04: resultset has one row_ 10 threads (all same workload)_elapsed time",
        value: -5.113737875548237,
      },
      {
        testcase:
          "benchCppSoltp_Select/04_00_t04: resultset has one row_ 10 threads (all same workload)_elapsed time",
        value: -5.180517119804983,
      },
      {
        testcase:
          "benchCppSoltp_Select/00_A01_t00: empty resultset_ 1 thread (all same workload)_elapsed time",
        value: -5.257955098544974,
      },
      {
        testcase:
          "benchCppSoltp_Select/00_07_t00: empty resultset_ 1 thread (all same workload)_elapsed time",
        value: -5.2785726308702206,
      },
      {
        testcase:
          "benchCppSoltp_Select/03_00_t03: resultset has one row_ 1 thread (all same workload)_elapsed time",
        value: -5.374538958472603,
      },
      {
        testcase:
          "benchCppSoltp_Select/01_01_t01: empty resultset_ 10 threads (all same workload)_elapsed time",
        value: -5.45550087854224,
      },
      {
        testcase: "benchCppSoltp_Delete/03_08_t03: Row Store_cpu time",
        value: -5.4611884234673935,
      },
      {
        testcase:
          "benchCppSoltp_Select/00_08_t00: empty resultset_ 1 thread (all same workload)_elapsed time",
        value: -5.5173188662810775,
      },
      {
        testcase:
          "benchCppSoltp_Select/01_00_t01: empty resultset_ 10 threads (all same workload)_elapsed time",
        value: -5.637669392084046,
      },
      {
        testcase:
          "benchCppSoltp_Select/00_03_t00: empty resultset_ 1 thread (all same workload)_elapsed time",
        value: -5.6431954555001935,
      },
      {
        testcase:
          "benchCppSoltp_Select/04_07_t04: resultset has one row_ 10 threads (all same workload)_elapsed time",
        value: -5.852060492775448,
      },
      {
        testcase:
          "benchCppSoltp_Select/00_A02_t00: empty resultset_ 1 thread (all same workload)_cpu time",
        value: -5.855654036398331,
      },
      {
        testcase:
          "benchCppSoltp_Select/01_A00_t01: empty resultset_ 10 threads (all same workload)_elapsed time",
        value: -5.921660361793024,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_06_t01: Table in Delta_ no merges_cpu time",
        value: -5.9696713232361915,
      },
      {
        testcase:
          "benchCppSoltp_Select/05_A02_t05: resultset has one row_ 100 threads (all same workload)_elapsed time",
        value: -6.002666698973003,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_07_t02: Table in Main_ no merges_cpu time",
        value: -6.035687831280101,
      },
      {
        testcase:
          "benchCppSoltp_Delete/00_07_t00: Table in Main_ regularly merged_cpu time",
        value: -6.045822594198699,
      },
      {
        testcase:
          "benchCppSoltp_Update/02_15_t02: Table in Main_ no merges_cpu time",
        value: -6.0830105743632865,
      },
      {
        testcase:
          "benchCppSoltp_Select/00_05_t00: empty resultset_ 1 thread (all same workload)_elapsed time",
        value: -6.095901172082608,
      },
      {
        testcase: "benchCppSoltp_Delete/03_07_t03: Row Store_cpu time",
        value: -6.1501235274648245,
      },
      {
        testcase:
          "benchCppSoltp_Select/04_A02_t04: resultset has one row_ 10 threads (all same workload)_elapsed time",
        value: -6.156024565783813,
      },
      {
        testcase:
          "benchCppSoltp_Select/01_07_t01: empty resultset_ 10 threads (all same workload)_elapsed time",
        value: -6.389374546150072,
      },
      {
        testcase:
          "benchCppSoltp_Select/01_A02_t01: empty resultset_ 10 threads (all same workload)_elapsed time",
        value: -6.463061410768605,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/04_05_t04: P*Time_ 10 threads x 10k reps_elapsed time",
        value: -6.466899070477097,
      },
      {
        testcase:
          "benchCppSoltp_Select/01_06_t01: empty resultset_ 10 threads (all same workload)_elapsed time",
        value: -6.551507173488718,
      },
      {
        testcase:
          "benchCppSoltp_Select/05_01_t05: resultset has one row_ 100 threads (all same workload)_cpu time",
        value: -6.572727166254988,
      },
      {
        testcase:
          "benchCppSoltp_Select/01_05_t01: empty resultset_ 10 threads (all same workload)_elapsed time",
        value: -6.590524215742308,
      },
      {
        testcase: "benchCppSoltp_Delete/03_06_t03: Row Store_cpu time",
        value: -6.661920953132938,
      },
      {
        testcase:
          "benchCppSoltp_Delete/02_07_t02: Table in Main_ no merges_cpu time",
        value: -6.749761684186834,
      },
      {
        testcase: "benchCppSoltp_Update/03_15_t03: Row Store_cpu time",
        value: -6.829168595820965,
      },
      {
        testcase:
          "benchCppSoltp_Select/04_06_t04: resultset has one row_ 10 threads (all same workload)_elapsed time",
        value: -6.914824775440673,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_15_t01: Table in Delta_ no merges_cpu time",
        value: -7.057764777454068,
      },
      {
        testcase: "benchCppSoltp_Update/03_07_t03: Row Store_cpu time",
        value: -7.171062214820841,
      },
      {
        testcase: "benchCppSoltp_Update/03_06_t03: Row Store_cpu time",
        value: -7.173635076847873,
      },
      {
        testcase:
          "benchCppSoltp_Select/05_A00_t05: resultset has one row_ 100 threads (all same workload)_cpu time",
        value: -7.204343106523916,
      },
      {
        testcase:
          "benchCppSoltp_Select/05_02_t05: resultset has one row_ 100 threads (all same workload)_cpu time",
        value: -7.243178693771376,
      },
      {
        testcase:
          "benchCppSoltp_Select/01_03_t01: empty resultset_ 10 threads (all same workload)_elapsed time",
        value: -7.317634666709804,
      },
      {
        testcase:
          "benchCppSoltp_Select/00_A02_t00: empty resultset_ 1 thread (all same workload)_elapsed time",
        value: -7.345363956738362,
      },
      {
        testcase: "benchCppSoltp_Insert/02_17_t02: Row Store_cpu time",
        value: -7.387656374867966,
      },
      {
        testcase: "benchCppSoltp_Insert/02_15_t02: Row Store_cpu time",
        value: -7.422411990280819,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_08_t01: Table in Delta_ no merges_cpu time",
        value: -7.422841875566573,
      },
      {
        testcase:
          "benchCppSoltp_Select/05_A01_t05: resultset has one row_ 100 threads (all same workload)_cpu time",
        value: -7.458343280772697,
      },
      {
        testcase: "benchCppSoltp_Insert/01_15_t01: Delta (no merges)_cpu time",
        value: -7.464681209165199,
      },
      {
        testcase: "benchCppSoltp_Update/03_08_t03: Row Store_cpu time",
        value: -7.602236508639807,
      },
      {
        testcase:
          "benchCppSoltp_Select/05_04_t05: resultset has one row_ 100 threads (all same workload)_cpu time",
        value: -7.733294781157034,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/05_02_t05: P*Time_ 100 threads x 5k reps_cpu time",
        value: -7.747890106393264,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_17_t01: Table in Delta_ no merges_cpu time",
        value: -7.916874279717403,
      },
      {
        testcase: "benchCppSoltp_Update/03_16_t03: Row Store_cpu time",
        value: -7.9332532785862,
      },
      {
        testcase: "benchCppSoltp_Insert/02_16_t02: Row Store_cpu time",
        value: -8.033820558986026,
      },
      {
        testcase: "benchCppSoltp_Insert/02_A02_t02: Row Store_cpu time",
        value: -8.061810449708707,
      },
      {
        testcase:
          "benchCppSoltp_Delete/02_06_t02: Table in Main_ no merges_cpu time",
        value: -8.070558159316581,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/02_02_t02: JoinEngine_ 100 threads x 5k reps_cpu time",
        value: -8.071788985631207,
      },
      {
        testcase:
          "benchCppSoltp_Delete/02_08_t02: Table in Main_ no merges_cpu time",
        value: -8.094235749588691,
      },
      {
        testcase:
          "benchCppSoltp_Select/05_05_t05: resultset has one row_ 100 threads (all same workload)_cpu time",
        value: -8.137853439799965,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/05_03_t05: P*Time_ 100 threads x 5k reps_cpu time",
        value: -8.155290592139862,
      },
      {
        testcase:
          "benchCppSoltp_Select/02_03_t02: empty resultset_ 100 threads (all same workload)_cpu time",
        value: -8.218690378339565,
      },
      {
        testcase:
          "benchCppSoltp_Select/02_06_t02: empty resultset_ 100 threads (all same workload)_cpu time",
        value: -8.23892178753174,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/05_00_t05: P*Time_ 100 threads x 5k reps_cpu time",
        value: -8.336670896577383,
      },
      {
        testcase:
          "benchCppSoltp_Select/02_A02_t02: empty resultset_ 100 threads (all same workload)_cpu time",
        value: -8.513189507108503,
      },
      {
        testcase:
          "benchCppSoltp_Select/05_06_t05: resultset has one row_ 100 threads (all same workload)_elapsed time",
        value: -8.548399763941918,
      },
      {
        testcase:
          "benchCppSoltp_Select/02_05_t02: empty resultset_ 100 threads (all same workload)_cpu time",
        value: -8.58191464505001,
      },
      {
        testcase:
          "benchCppSoltp_Delete/01_06_t01: Table in Delta_ no merges_cpu time",
        value: -8.58898333074501,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_16_t01: Table in Delta_ no merges_cpu time",
        value: -8.675885640596393,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/02_01_t02: JoinEngine_ 100 threads x 5k reps_cpu time",
        value: -8.745675458406348,
      },
      {
        testcase:
          "benchCppSoltp_Select/05_03_t05: resultset has one row_ 100 threads (all same workload)_cpu time",
        value: -8.787572694609462,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/05_04_t05: P*Time_ 100 threads x 5k reps_cpu time",
        value: -8.816932599991755,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/05_01_t05: P*Time_ 100 threads x 5k reps_cpu time",
        value: -8.839418265877399,
      },
      {
        testcase:
          "benchCppSoltp_Select/02_07_t02: empty resultset_ 100 threads (all same workload)_cpu time",
        value: -9.047228625223848,
      },
      {
        testcase:
          "benchCppSoltp_Delete/01_07_t01: Table in Delta_ no merges_cpu time",
        value: -9.069070396343214,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/05_05_t05: P*Time_ 100 threads x 10k reps_cpu time",
        value: -9.078385008310372,
      },
      {
        testcase:
          "benchCppSoltp_Select/02_01_t02: empty resultset_ 100 threads (all same workload)_cpu time",
        value: -9.125796517735193,
      },
      {
        testcase:
          "benchCppSoltp_Select/02_04_t02: empty resultset_ 100 threads (all same workload)_cpu time",
        value: -9.151993231697983,
      },
      {
        testcase:
          "benchCppSoltp_Select/02_A01_t02: empty resultset_ 100 threads (all same workload)_cpu time",
        value: -9.214474345706874,
      },
      {
        testcase:
          "benchCppSoltp_Select/02_A00_t02: empty resultset_ 100 threads (all same workload)_cpu time",
        value: -9.220783907785407,
      },
      {
        testcase:
          "benchCppSoltp_Update/01_07_t01: Table in Delta_ no merges_cpu time",
        value: -9.331969546084393,
      },
      {
        testcase:
          "benchCppSoltp_Select/05_00_t05: resultset has one row_ 100 threads (all same workload)_cpu time",
        value: -9.355237513158064,
      },
      {
        testcase:
          "benchCppSoltp_Select/05_07_t05: resultset has one row_ 100 threads (all same workload)_cpu time",
        value: -9.523224230662356,
      },
      {
        testcase:
          "benchCppSoltp_Delete/01_08_t01: Table in Delta_ no merges_cpu time",
        value: -9.552314311690012,
      },
      {
        testcase:
          "benchCppSoltp_Select/02_00_t02: empty resultset_ 100 threads (all same workload)_cpu time",
        value: -9.732336208117898,
      },
      {
        testcase:
          "benchCppSoltp_Select/02_02_t02: empty resultset_ 100 threads (all same workload)_cpu time",
        value: -9.889090007783999,
      },
      {
        testcase:
          "benchCppSoltp_Select/05_A02_t05: resultset has one row_ 100 threads (all same workload)_cpu time",
        value: -9.915740525677359,
      },
      {
        testcase: "benchCppSoltp_Update/03_17_t03: Row Store_cpu time",
        value: -10.197386609509692,
      },
      {
        testcase:
          "benchCppSoltp_Select/05_06_t05: resultset has one row_ 100 threads (all same workload)_cpu time",
        value: -10.5458432414429,
      },
      {
        testcase:
          "benchCppSoltp_Select/02_08_t02: empty resultset_ 100 threads (all same workload)_cpu time",
        value: -10.737913425908694,
      },
      {
        testcase:
          "benchCppSoltp_JoinSelect/02_00_t02: JoinEngine_ 100 threads x 5k reps_cpu time",
        value: -11.197515777040241,
      },
      {
        testcase:
          "benchCppSoltp_Select/05_08_t05: resultset has one row_ 100 threads (all same workload)_cpu time",
        value: -11.224292284453496,
      },
    ],
    intervals: [
      [-12, -9],
      [-9, -6],
      [-6, -3],
      [-3, 0],
      [0, 3],
      [3, 6],
      [6, 9],
      [9, 12],
      [12, 15],
      [15, 18],
      [18, 21],
      [21, 24],
      [24, 27],
      [27, 30],
      [30, 33],
      [33, 36],
      [36, 39],
      [39, 42],
      [42, 45],
      [45, 48],
      [48, 51],
      [51, 54],
      [54, 57],
      [57, 60],
      [60, 63],
      [63, 66],
    ],
    values: [
      19, 53, 82, 137, 128, 84, 67, 34, 34, 29, 13, 5, 4, 1, 1, 2, 0, 3, 0, 0,
      0, 0, 0, 0, 0, 1,
    ],
  };

  return (
    <MainPage
      title="Junit comparison"
      description="Compare 2 topics togethers and see how your tests behave in term of performance."
      Breadcrumb={
        <Breadcrumb
          links={[
            { to: "/", title: "DCI" },
            { to: "/analytics", title: "Analytics" },
            { title: "Junit comparison" },
          ]}
        />
      }
    >
      <Card>
        <CardBody>
          <div style={{ width: "100%", minHeight: "400px", height: "400px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={data.values.map((v, i) => {
                  const [y1, y2] = data.intervals[i];
                  return { y: v, x: (y1 + y2) / 2 };
                })}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" />
                <YAxis />
                <Tooltip />
                {/* <Legend /> */}
                <Bar dataKey="y" fill="#0066CC" name="# tests" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>
    </MainPage>
  );
}
