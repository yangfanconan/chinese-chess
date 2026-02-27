/**
 * 中国象棋规则核心模块
 * 实现所有棋子的走法规则、将军判定、胜负判定等核心逻辑
 */

const ChessRules = (function() {
    'use strict';

    const HONG_FANG = 'hong';
    const HEI_FANG = 'hei';

    const QI_ZI_LEI_XING = {
        JIANG_SHUAI: 'jiang_shuai',
        SHI: 'shi',
        XIANG: 'xiang',
        MA: 'ma',
        CHE: 'che',
        PAO: 'pao',
        BING_ZU: 'bing_zu'
    };

    const QI_ZI_MING_CHENG = {
        [QI_ZI_LEI_XING.JIANG_SHUAI]: { [HONG_FANG]: '帥', [HEI_FANG]: '將' },
        [QI_ZI_LEI_XING.SHI]: { [HONG_FANG]: '仕', [HEI_FANG]: '士' },
        [QI_ZI_LEI_XING.XIANG]: { [HONG_FANG]: '相', [HEI_FANG]: '象' },
        [QI_ZI_LEI_XING.MA]: { [HONG_FANG]: '傌', [HEI_FANG]: '馬' },
        [QI_ZI_LEI_XING.CHE]: { [HONG_FANG]: '俥', [HEI_FANG]: '車' },
        [QI_ZI_LEI_XING.PAO]: { [HONG_FANG]: '炮', [HEI_FANG]: '砲' },
        [QI_ZI_LEI_XING.BING_ZU]: { [HONG_FANG]: '兵', [HEI_FANG]: '卒' }
    };

    /**
     * 创建初始棋盘状态
     * 返回9x10的二维数组，表示棋盘上每个位置的棋子信息
     */
    function chuangJianChuShiQiPan() {
        const qiPan = Array(10).fill(null).map(() => Array(9).fill(null));

        heiFangChuShiBuZi(qiPan);
        hongFangChuShiBuZi(qiPan);

        return qiPan;
    }

    /**
     * 黑方初始布子
     */
    function heiFangChuShiBuZi(qiPan) {
        qiPan[0][0] = { leiXing: QI_ZI_LEI_XING.CHE, fang: HEI_FANG };
        qiPan[0][1] = { leiXing: QI_ZI_LEI_XING.MA, fang: HEI_FANG };
        qiPan[0][2] = { leiXing: QI_ZI_LEI_XING.XIANG, fang: HEI_FANG };
        qiPan[0][3] = { leiXing: QI_ZI_LEI_XING.SHI, fang: HEI_FANG };
        qiPan[0][4] = { leiXing: QI_ZI_LEI_XING.JIANG_SHUAI, fang: HEI_FANG };
        qiPan[0][5] = { leiXing: QI_ZI_LEI_XING.SHI, fang: HEI_FANG };
        qiPan[0][6] = { leiXing: QI_ZI_LEI_XING.XIANG, fang: HEI_FANG };
        qiPan[0][7] = { leiXing: QI_ZI_LEI_XING.MA, fang: HEI_FANG };
        qiPan[0][8] = { leiXing: QI_ZI_LEI_XING.CHE, fang: HEI_FANG };
        qiPan[2][1] = { leiXing: QI_ZI_LEI_XING.PAO, fang: HEI_FANG };
        qiPan[2][7] = { leiXing: QI_ZI_LEI_XING.PAO, fang: HEI_FANG };
        qiPan[3][0] = { leiXing: QI_ZI_LEI_XING.BING_ZU, fang: HEI_FANG };
        qiPan[3][2] = { leiXing: QI_ZI_LEI_XING.BING_ZU, fang: HEI_FANG };
        qiPan[3][4] = { leiXing: QI_ZI_LEI_XING.BING_ZU, fang: HEI_FANG };
        qiPan[3][6] = { leiXing: QI_ZI_LEI_XING.BING_ZU, fang: HEI_FANG };
        qiPan[3][8] = { leiXing: QI_ZI_LEI_XING.BING_ZU, fang: HEI_FANG };
    }

    /**
     * 红方初始布子
     */
    function hongFangChuShiBuZi(qiPan) {
        qiPan[9][0] = { leiXing: QI_ZI_LEI_XING.CHE, fang: HONG_FANG };
        qiPan[9][1] = { leiXing: QI_ZI_LEI_XING.MA, fang: HONG_FANG };
        qiPan[9][2] = { leiXing: QI_ZI_LEI_XING.XIANG, fang: HONG_FANG };
        qiPan[9][3] = { leiXing: QI_ZI_LEI_XING.SHI, fang: HONG_FANG };
        qiPan[9][4] = { leiXing: QI_ZI_LEI_XING.JIANG_SHUAI, fang: HONG_FANG };
        qiPan[9][5] = { leiXing: QI_ZI_LEI_XING.SHI, fang: HONG_FANG };
        qiPan[9][6] = { leiXing: QI_ZI_LEI_XING.XIANG, fang: HONG_FANG };
        qiPan[9][7] = { leiXing: QI_ZI_LEI_XING.MA, fang: HONG_FANG };
        qiPan[9][8] = { leiXing: QI_ZI_LEI_XING.CHE, fang: HONG_FANG };
        qiPan[7][1] = { leiXing: QI_ZI_LEI_XING.PAO, fang: HONG_FANG };
        qiPan[7][7] = { leiXing: QI_ZI_LEI_XING.PAO, fang: HONG_FANG };
        qiPan[6][0] = { leiXing: QI_ZI_LEI_XING.BING_ZU, fang: HONG_FANG };
        qiPan[6][2] = { leiXing: QI_ZI_LEI_XING.BING_ZU, fang: HONG_FANG };
        qiPan[6][4] = { leiXing: QI_ZI_LEI_XING.BING_ZU, fang: HONG_FANG };
        qiPan[6][6] = { leiXing: QI_ZI_LEI_XING.BING_ZU, fang: HONG_FANG };
        qiPan[6][8] = { leiXing: QI_ZI_LEI_XING.BING_ZU, fang: HONG_FANG };
    }

    /**
     * 获取棋子显示名称
     */
    function huoQuQiZiMingCheng(qiZi) {
        if (!qiZi) return '';
        return QI_ZI_MING_CHENG[qiZi.leiXing][qiZi.fang];
    }

    /**
     * 检查位置是否在棋盘范围内
     */
    function shiFouZaiQiPanNei(hang, lie) {
        return hang >= 0 && hang <= 9 && lie >= 0 && lie <= 8;
    }

    /**
     * 检查位置是否在九宫格内
     */
    function shiFouZaiJiuGongNei(hang, lie, fang) {
        const lieFanWei = lie >= 3 && lie <= 5;
        if (fang === HONG_FANG) {
            return hang >= 7 && hang <= 9 && lieFanWei;
        } else {
            return hang >= 0 && hang <= 2 && lieFanWei;
        }
    }

    /**
     * 检查位置是否在本方半场
     */
    function shiFouZaiBenFangBanChang(hang, fang) {
        if (fang === HONG_FANG) {
            return hang >= 5;
        } else {
            return hang <= 4;
        }
    }

    /**
     * 检查兵/卒是否已过河
     */
    function bingZuShiFouGuoHe(hang, fang) {
        if (fang === HONG_FANG) {
            return hang <= 4;
        } else {
            return hang >= 5;
        }
    }

    /**
     * 计算两点之间的棋子数量（直线）
     */
    function jiSuanZhongJianQiZiShu(qiPan, qiHang, qiLie, zhongHang, zhongLie) {
        let shuLiang = 0;
        
        if (qiHang === zhongHang) {
            const minLie = Math.min(qiLie, zhongLie);
            const maxLie = Math.max(qiLie, zhongLie);
            for (let lie = minLie + 1; lie < maxLie; lie++) {
                if (qiPan[qiHang][lie]) shuLiang++;
            }
        } else if (qiLie === zhongLie) {
            const minHang = Math.min(qiHang, zhongHang);
            const maxHang = Math.max(qiHang, zhongHang);
            for (let hang = minHang + 1; hang < maxHang; hang++) {
                if (qiPan[hang][qiLie]) shuLiang++;
            }
        }
        
        return shuLiang;
    }

    /**
     * 获取马的蹩腿位置
     */
    function huoQuMaBieTuiWeiZhi(hang, lie, muBiaoHang, muBiaoLie) {
        const hangCha = muBiaoHang - hang;
        const lieCha = muBiaoLie - lie;

        if (Math.abs(hangCha) === 2) {
            return { hang: hang + hangCha / 2, lie: lie };
        } else if (Math.abs(lieCha) === 2) {
            return { hang: hang, lie: lie + lieCha / 2 };
        }
        return null;
    }

    /**
     * 获取象/相的塞眼位置
     */
    function huoQuXiangSaiYanWeiZhi(hang, lie, muBiaoHang, muBiaoLie) {
        return {
            hang: (hang + muBiaoHang) / 2,
            lie: (lie + muBiaoLie) / 2
        };
    }

    /**
     * 验证将/帅的走法
     * 规则：每次只能走一格，只能在九宫格内，可以横走或竖走
     */
    function yanZhengJiangShuaiZouFa(qiPan, qiHang, qiLie, muBiaoHang, muBiaoLie, fang) {
        if (!shiFouZaiJiuGongNei(muBiaoHang, muBiaoLie, fang)) {
            return false;
        }

        const hangCha = Math.abs(muBiaoHang - qiHang);
        const lieCha = Math.abs(muBiaoLie - qiLie);

        return (hangCha === 1 && lieCha === 0) || (hangCha === 0 && lieCha === 1);
    }

    /**
     * 验证士的走法
     * 规则：每次只能走一格，只能在九宫格内，只能斜走
     */
    function yanZhengShiZouFa(qiPan, qiHang, qiLie, muBiaoHang, muBiaoLie, fang) {
        if (!shiFouZaiJiuGongNei(muBiaoHang, muBiaoLie, fang)) {
            return false;
        }

        const hangCha = Math.abs(muBiaoHang - qiHang);
        const lieCha = Math.abs(muBiaoLie - qiLie);

        return hangCha === 1 && lieCha === 1;
    }

    /**
     * 验证象/相的走法
     * 规则：走"田"字，不能过河，不能塞象眼
     */
    function yanZhengXiangZouFa(qiPan, qiHang, qiLie, muBiaoHang, muBiaoLie, fang) {
        if (!shiFouZaiBenFangBanChang(muBiaoHang, fang)) {
            return false;
        }

        const hangCha = Math.abs(muBiaoHang - qiHang);
        const lieCha = Math.abs(muBiaoLie - qiLie);

        if (hangCha !== 2 || lieCha !== 2) {
            return false;
        }

        const saiYanWeiZhi = huoQuXiangSaiYanWeiZhi(qiHang, qiLie, muBiaoHang, muBiaoLie);
        if (qiPan[saiYanWeiZhi.hang][saiYanWeiZhi.lie]) {
            return false;
        }

        return true;
    }

    /**
     * 验证马的走法
     * 规则：走"日"字，不能蹩马腿
     */
    function yanZhengMaZouFa(qiPan, qiHang, qiLie, muBiaoHang, muBiaoLie) {
        const hangCha = Math.abs(muBiaoHang - qiHang);
        const lieCha = Math.abs(muBiaoLie - qiLie);

        if (!((hangCha === 2 && lieCha === 1) || (hangCha === 1 && lieCha === 2))) {
            return false;
        }

        const bieTuiWeiZhi = huoQuMaBieTuiWeiZhi(qiHang, qiLie, muBiaoHang, muBiaoLie);
        if (bieTuiWeiZhi && qiPan[bieTuiWeiZhi.hang][bieTuiWeiZhi.lie]) {
            return false;
        }

        return true;
    }

    /**
     * 验证车的走法
     * 规则：横竖走，不能越过棋子
     */
    function yanZhengCheZouFa(qiPan, qiHang, qiLie, muBiaoHang, muBiaoLie) {
        if (qiHang !== muBiaoHang && qiLie !== muBiaoLie) {
            return false;
        }

        return jiSuanZhongJianQiZiShu(qiPan, qiHang, qiLie, muBiaoHang, muBiaoLie) === 0;
    }

    /**
     * 验证炮的走法
     * 规则：移动时与车相同，吃子时必须隔一个棋子（炮架）
     */
    function yanZhengPaoZouFa(qiPan, qiHang, qiLie, muBiaoHang, muBiaoLie, muBiaoYouQiZi) {
        if (qiHang !== muBiaoHang && qiLie !== muBiaoLie) {
            return false;
        }

        const zhongJianShu = jiSuanZhongJianQiZiShu(qiPan, qiHang, qiLie, muBiaoHang, muBiaoLie);

        if (muBiaoYouQiZi) {
            return zhongJianShu === 1;
        } else {
            return zhongJianShu === 0;
        }
    }

    /**
     * 验证兵/卒的走法
     * 规则：过河前只能向前走一格，过河后可以向前或横走一格，不能后退，不能斜走
     */
    function yanZhengBingZuZouFa(qiPan, qiHang, qiLie, muBiaoHang, muBiaoLie, fang) {
        const hangCha = muBiaoHang - qiHang;
        const lieCha = Math.abs(muBiaoLie - qiLie);

        if (lieCha > 1 || Math.abs(hangCha) > 1) {
            return false;
        }

        if (lieCha > 0 && Math.abs(hangCha) > 0) {
            return false;
        }

        const yiGuoHe = bingZuShiFouGuoHe(qiHang, fang);

        if (fang === HONG_FANG) {
            if (hangCha > 0) return false;
            if (!yiGuoHe && lieCha > 0) return false;
        } else {
            if (hangCha < 0) return false;
            if (!yiGuoHe && lieCha > 0) return false;
        }

        return true;
    }

    /**
     * 验证走法是否合法
     */
    function yanZhengZouFaHeFa(qiPan, qiHang, qiLie, muBiaoHang, muBiaoLie) {
        const qiZi = qiPan[qiHang][qiLie];
        if (!qiZi) return false;

        const muBiaoQiZi = qiPan[muBiaoHang][muBiaoLie];
        if (muBiaoQiZi && muBiaoQiZi.fang === qiZi.fang) {
            return false;
        }

        if (qiHang === muBiaoHang && qiLie === muBiaoLie) {
            return false;
        }

        switch (qiZi.leiXing) {
            case QI_ZI_LEI_XING.JIANG_SHUAI:
                return yanZhengJiangShuaiZouFa(qiPan, qiHang, qiLie, muBiaoHang, muBiaoLie, qiZi.fang);
            case QI_ZI_LEI_XING.SHI:
                return yanZhengShiZouFa(qiPan, qiHang, qiLie, muBiaoHang, muBiaoLie, qiZi.fang);
            case QI_ZI_LEI_XING.XIANG:
                return yanZhengXiangZouFa(qiPan, qiHang, qiLie, muBiaoHang, muBiaoLie, qiZi.fang);
            case QI_ZI_LEI_XING.MA:
                return yanZhengMaZouFa(qiPan, qiHang, qiLie, muBiaoHang, muBiaoLie);
            case QI_ZI_LEI_XING.CHE:
                return yanZhengCheZouFa(qiPan, qiHang, qiLie, muBiaoHang, muBiaoLie);
            case QI_ZI_LEI_XING.PAO:
                return yanZhengPaoZouFa(qiPan, qiHang, qiLie, muBiaoHang, muBiaoLie, !!muBiaoQiZi);
            case QI_ZI_LEI_XING.BING_ZU:
                return yanZhengBingZuZouFa(qiPan, qiHang, qiLie, muBiaoHang, muBiaoLie, qiZi.fang);
            default:
                return false;
        }
    }

    /**
     * 获取棋子所有可能的移动位置
     */
    function huoQuSuoYouKeDongWeiZhi(qiPan, hang, lie) {
        const keDongWeiZhi = [];
        const qiZi = qiPan[hang][lie];
        if (!qiZi) return keDongWeiZhi;

        for (let h = 0; h < 10; h++) {
            for (let l = 0; l < 9; l++) {
                if (yanZhengZouFaHeFa(qiPan, hang, lie, h, l)) {
                    keDongWeiZhi.push({ hang: h, lie: l });
                }
            }
        }

        return keDongWeiZhi;
    }

    /**
     * 执行移动棋子
     */
    function zhiXingYiDong(qiPan, qiHang, qiLie, muBiaoHang, muBiaoLie) {
        const beiChiQiZi = qiPan[muBiaoHang][muBiaoLie];
        qiPan[muBiaoHang][muBiaoLie] = qiPan[qiHang][qiLie];
        qiPan[qiHang][qiLie] = null;
        return beiChiQiZi;
    }

    /**
     * 撤销移动棋子
     */
    function cheXiaoYiDong(qiPan, qiHang, qiLie, muBiaoHang, muBiaoLie, beiChiQiZi) {
        qiPan[qiHang][qiLie] = qiPan[muBiaoHang][muBiaoLie];
        qiPan[muBiaoHang][muBiaoLie] = beiChiQiZi;
    }

    /**
     * 查找将/帅的位置
     */
    function chaZhaoJiangShuaiWeiZhi(qiPan, fang) {
        for (let hang = 0; hang < 10; hang++) {
            for (let lie = 0; lie < 9; lie++) {
                const qiZi = qiPan[hang][lie];
                if (qiZi && qiZi.fang === fang && qiZi.leiXing === QI_ZI_LEI_XING.JIANG_SHUAI) {
                    return { hang, lie };
                }
            }
        }
        return null;
    }

    /**
     * 检查是否被将军
     */
    function jianChaShiFouBeiJiangJun(qiPan, fang) {
        const jiangShuaiWeiZhi = chaZhaoJiangShuaiWeiZhi(qiPan, fang);
        if (!jiangShuaiWeiZhi) return false;

        const duiShouFang = fang === HONG_FANG ? HEI_FANG : HONG_FANG;

        for (let hang = 0; hang < 10; hang++) {
            for (let lie = 0; lie < 9; lie++) {
                const qiZi = qiPan[hang][lie];
                if (qiZi && qiZi.fang === duiShouFang) {
                    if (yanZhengZouFaHeFa(qiPan, hang, lie, jiangShuaiWeiZhi.hang, jiangShuaiWeiZhi.lie)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    /**
     * 检查将帅是否照面（飞将）
     */
    function jianChaJiangShuaiZhaoMian(qiPan) {
        const hongJiangWeiZhi = chaZhaoJiangShuaiWeiZhi(qiPan, HONG_FANG);
        const heiJiangWeiZhi = chaZhaoJiangShuaiWeiZhi(qiPan, HEI_FANG);

        if (!hongJiangWeiZhi || !heiJiangWeiZhi) return false;
        if (hongJiangWeiZhi.lie !== heiJiangWeiZhi.lie) return false;

        const zhongJianShu = jiSuanZhongJianQiZiShu(
            qiPan, 
            hongJiangWeiZhi.hang, 
            hongJiangWeiZhi.lie, 
            heiJiangWeiZhi.hang, 
            heiJiangWeiZhi.lie
        );

        return zhongJianShu === 0;
    }

    /**
     * 验证走法是否会导致被将军（包括飞将）
     */
    function yanZhengZouFaBuZhiBeiJiangJun(qiPan, qiHang, qiLie, muBiaoHang, muBiaoLie, fang) {
        const beiChiQiZi = zhiXingYiDong(qiPan, qiHang, qiLie, muBiaoHang, muBiaoLie);

        const beiJiangJun = jianChaShiFouBeiJiangJun(qiPan, fang);
        const zhaoMian = jianChaJiangShuaiZhaoMian(qiPan);

        cheXiaoYiDong(qiPan, qiHang, qiLie, muBiaoHang, muBiaoLie, beiChiQiZi);

        return !beiJiangJun && !zhaoMian;
    }

    /**
     * 获取合法的移动位置（考虑将军）
     */
    function huoQuHeFaYiDongWeiZhi(qiPan, hang, lie) {
        const qiZi = qiPan[hang][lie];
        if (!qiZi) return [];

        return huoQuSuoYouKeDongWeiZhi(qiPan, hang, lie).filter(weiZhi => 
            yanZhengZouFaBuZhiBeiJiangJun(qiPan, hang, lie, weiZhi.hang, weiZhi.lie, qiZi.fang)
        );
    }

    /**
     * 检查是否被将死
     */
    function jianChaShiFouBeiJiangSi(qiPan, fang) {
        for (let hang = 0; hang < 10; hang++) {
            for (let lie = 0; lie < 9; lie++) {
                const qiZi = qiPan[hang][lie];
                if (qiZi && qiZi.fang === fang) {
                    const heFaWeiZhi = huoQuHeFaYiDongWeiZhi(qiPan, hang, lie);
                    if (heFaWeiZhi.length > 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    return {
        HONG_FANG,
        HEI_FANG,
        QI_ZI_LEI_XING,
        chuangJianChuShiQiPan,
        huoQuQiZiMingCheng,
        shiFouZaiQiPanNei,
        bingZuShiFouGuoHe,
        yanZhengZouFaHeFa,
        yanZhengZouFaBuZhiBeiJiangJun,
        huoQuSuoYouKeDongWeiZhi,
        huoQuHeFaYiDongWeiZhi,
        zhiXingYiDong,
        cheXiaoYiDong,
        jianChaShiFouBeiJiangJun,
        jianChaJiangShuaiZhaoMian,
        jianChaShiFouBeiJiangSi,
        chaZhaoJiangShuaiWeiZhi
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChessRules;
}
