/* eslint-disable import/no-extraneous-dependencies */
import Mock from "mockjs";

//const Random = Mock.Random; // Mock.Random 是一个工具类，用于生成各种随机数据

Mock.mock("/admin/getCode", "post", {
  code: 0
});
Mock.mock("/admin/login", "post", {
  code: 0,
  model: {
    name: "管理员xxx",
    level: "1"
  }
});
Mock.mock("/admin/logout", "post", {
  code: 0
});
//获取把枪数据
Mock.mock("/admin/gunRegist/listInfo", "post", {
  ret: 0,
  success: true,
  model: {
    data: [
      {
        area: "总部",
        areaCode: null,
        city: "总部",
        cityCode: null,
        empCode: "001122",
        id: 15,
        mobile: "18040645262",
        registTime: "2020-07-23",
        total: 100,
        score: 20,
        totalScore: 1,
        status: "进行中"
      },
      {
        area: "华南大区",
        areaCode: null,
        city: "深圳区",
        cityCode: null,
        empCode: "001124",
        id: 20,
        mobile: "13016445798",
        registTime: "2020-07-24",
        total: 70,
        score: 148,
        totalScore: 1,
        status: "未开始"
      },
      {
        area: "华南大区",
        areaCode: null,
        city: "潮汕区",
        cityCode: null,
        empCode: "042300",
        id: 13,
        mobile: "18040645262",
        registTime: "2020-07-25",
        total: 180,
        score: 359,
        totalScore: 0,
        status: "进行中"
      },
      {
        area: "华南大区",
        areaCode: null,
        city: "潮汕区",
        cityCode: null,
        empCode: "042301",
        id: 12,
        mobile: "18040645262",
        registTime: "2020-07-26",
        total: 352,
        score: 198,
        totalScore: 1,
        status: "已结束"
      },
      {
        area: "总部",
        areaCode: null,
        city: "总部",
        cityCode: null,
        empCode: "1101t",
        id: 1,
        mobile: "110",
        registTime: "2020-07-27",
        total: 165,
        score: 48,
        totalScore: 4,
        status: "未开始"
      }
    ]
  }
});
//获取大区数据
Mock.mock("/admin/region/list", "post", {
  ret: 0,
  success: true,
  model: {
    data: [
      {
        region: "华北大区",
        regionId: "QNvObpoI6JtSoqgjJmB4N2tS9ZIFdW"
      },
      {
        region: "华东大区",
        regionId: "jsuamO91gLPpXRT6hGELPv0oVdPQXW"
      },
      {
        region: "华南大区",
        regionId: "FSRlJeax6AQL2lrehy9LibJFTrzeWE"
      },
      {
        region: "中西大区",
        regionId: "wLtfu8u7BVSQmiO6cDk41Fasdjcpau"
      },
      {
        region: "总部",
        regionId: "ZkPGmyDpi4GIRb1AYHCJQlhnNxXSZp"
      }
    ]
  }
});
//获取地区数据
Mock.mock("/admin/area/list/", "post", {
  ret: 0,
  success: true,
  model: {
    data: [
      {
        area: "黑龙江区",
        areaId: "xCr6TFCkCSxpeEaoZhYNvP7Q9QL1uG",
        id: 61,
        missionSign: 0,
        regionId: "QNvObpoI6JtSoqgjJmB4N2tS9ZIFdW"
      },
      {
        area: "鲁中区",
        areaId: "aNQIJUyr5o4JnidrYubWYvvkiT91wB",
        id: 62,
        missionSign: 0,
        regionId: "QNvObpoI6JtSoqgjJmB4N2tS9ZIFdW"
      },
      {
        area: "大连区",
        areaId: "FYFGduMxPA2qMPRTNOpRgaNVQPsdjS",
        id: 63,
        missionSign: 0,
        regionId: "QNvObpoI6JtSoqgjJmB4N2tS9ZIFdW"
      },
      {
        area: "北京区",
        areaId: "6LZ1SNajWfyHQeMQCyjW3xKV1zfpb0",
        id: 64,
        missionSign: 0,
        regionId: "QNvObpoI6JtSoqgjJmB4N2tS9ZIFdW"
      },
      {
        area: "济南区",
        areaId: "JcMAe0avMdlVlSoPBj1ttaJ6iHLvBJ",
        id: 65,
        missionSign: 0,
        regionId: "QNvObpoI6JtSoqgjJmB4N2tS9ZIFdW"
      },
      {
        area: "沈阳区",
        areaId: "5x6auBl3A9Tmnz3uvrmPOW3WQ9r9NX",
        id: 66,
        missionSign: 0,
        regionId: "QNvObpoI6JtSoqgjJmB4N2tS9ZIFdW"
      },
      {
        area: "山西区",
        areaId: "Qmb0se69awli8UJNr13Mb5nWIknQbu",
        id: 67,
        missionSign: 0,
        regionId: "QNvObpoI6JtSoqgjJmB4N2tS9ZIFdW"
      },
      {
        area: "冀北区",
        areaId: "luksuYEsB55Nxli1efgT1CUE0UqqfM",
        id: 68,
        missionSign: 0,
        regionId: "QNvObpoI6JtSoqgjJmB4N2tS9ZIFdW"
      }
    ]
  }
});
//预热会场-获取统计数据
Mock.mock("/admin/preheat/statistic/getPage", "post", {
  code: 200,
  success: true,
  msg:"操作成功",
  data: {
    sumStatistic:{
      id:1,
      pv:200,
      uv:200
    },
    statisticList:{
      total:2,
      size:10,
      current:1,
      records:[
        {
        id:'02',
        date:'2021-11-11',
        pv:"100",
        uv:"100",
        inviteOpenCount:"1",
        inviteOpenNum:"2",
        redirectAppCount:"3",
        redirectAppNum:"4",
        shareCount:"5",
        shareNum:"6",
        subCount:"7",
        subNum:"8",
        visitTorchTransmitCount:"9",
        visitTorchTransmitNum:"10",
        helpSuccessCount:"11",
        helpSuccessNum:"12",
        torchTransmitSuccessCount:"13",
        torchTransmitSuccessNum:"14",
        lotterySuccessCount:"15",
        lotterySuccessNum:"16",
        createTime:"2021-11-11"
      },{
        id:'01',
        date:'2021-11-11',
        pv:"100",
        uv:"100",
        inviteOpenCount:"1",
        inviteOpenNum:"2",
        redirectAppCount:"3",
        redirectAppNum:"4",
        shareCount:"5",
        shareNum:"6",
        subCount:"7",
        subNum:"8",
        visitTorchTransmitCount:"9",
        visitTorchTransmitNum:"10",
        helpSuccessCount:"11",
        helpSuccessNum:"12",
        torchTransmitSuccessCount:"13",
        torchTransmitSuccessNum:"14",
        lotterySuccessCount:"15",
        lotterySuccessNum:"16",
        createTime:"2021-11-11"
      }]
    }
  }
});
