/**
 * 中国象棋AI模块（优化版）
 * 使用简化评估函数，确保秒级响应
 */

const ChessAI = (function() {
    'use strict';

    const QI_ZI_JIA_ZHI = {
        [ChessRules.QI_ZI_LEI_XING.JIANG_SHUAI]: 100000,
        [ChessRules.QI_ZI_LEI_XING.CHE]: 1000,
        [ChessRules.QI_ZI_LEI_XING.PAO]: 500,
        [ChessRules.QI_ZI_LEI_XING.MA]: 450,
        [ChessRules.QI_ZI_LEI_XING.XIANG]: 200,
        [ChessRules.QI_ZI_LEI_XING.SHI]: 200,
        [ChessRules.QI_ZI_LEI_XING.BING_ZU]: 100
    };

    let souSuoShenDu = 2;

    function sheZhiNanDu(nanDu) {
        souSuoShenDu = Math.max(1, Math.min(3, nanDu));
        console.log('AI难度设置为:', souSuoShenDu);
    }

    /**
     * 简化评估函数
     */
    function pingGuJuMian(qiPan, fang) {
        let fenShu = 0;

        for (let hang = 0; hang < 10; hang++) {
            for (let lie = 0; lie < 9; lie++) {
                const qiZi = qiPan[hang][lie];
                if (qiZi) {
                    let qiZiFen = QI_ZI_JIA_ZHI[qiZi.leiXing];
                    
                    if (qiZi.leiXing === ChessRules.QI_ZI_LEI_XING.BING_ZU) {
                        const yiGuoHe = ChessRules.bingZuShiFouGuoHe(hang, qiZi.fang);
                        if (yiGuoHe) qiZiFen += 50;
                    }
                    
                    if (qiZi.leiXing === ChessRules.QI_ZI_LEI_XING.MA) {
                        if ((hang >= 3 && hang <= 6) && (lie >= 3 && lie <= 5)) {
                            qiZiFen += 20;
                        }
                    }
                    
                    if (qiZi.leiXing === ChessRules.QI_ZI_LEI_XING.CHE) {
                        qiZiFen += (hang <= 2 || hang >= 7) ? 10 : 0;
                    }

                    if (qiZi.fang === fang) {
                        fenShu += qiZiFen;
                    } else {
                        fenShu -= qiZiFen;
                    }
                }
            }
        }

        return fenShu;
    }

    /**
     * 获取所有走法（带排序优化）
     */
    function huoQuSuoYouZouFa(qiPan, fang) {
        const zouFaLieBiao = [];

        for (let hang = 0; hang < 10; hang++) {
            for (let lie = 0; lie < 9; lie++) {
                const qiZi = qiPan[hang][lie];
                if (qiZi && qiZi.fang === fang) {
                    const keDongWeiZhi = ChessRules.huoQuHeFaYiDongWeiZhi(qiPan, hang, lie);
                    keDongWeiZhi.forEach(weiZhi => {
                        const muBiaoQiZi = qiPan[weiZhi.hang][weiZhi.lie];
                        const youXianJi = muBiaoQiZi ? QI_ZI_JIA_ZHI[muBiaoQiZi.leiXing] : 0;
                        zouFaLieBiao.push({
                            qiHang: hang,
                            qiLie: lie,
                            muBiaoHang: weiZhi.hang,
                            muBiaoLie: weiZhi.lie,
                            youXianJi
                        });
                    });
                }
            }
        }

        zouFaLieBiao.sort((a, b) => b.youXianJi - a.youXianJi);
        return zouFaLieBiao;
    }

    /**
     * Alpha-Beta搜索（简化版）
     */
    function alphaBeta(qiPan, shenDu, alpha, beta, shiFouZuiDaHua, fang) {
        if (shenDu === 0) {
            return pingGuJuMian(qiPan, fang);
        }

        const dangQianFang = shiFouZuiDaHua ? fang : (fang === ChessRules.HONG_FANG ? ChessRules.HEI_FANG : ChessRules.HONG_FANG);
        const zouFaLieBiao = huoQuSuoYouZouFa(qiPan, dangQianFang);

        if (zouFaLieBiao.length === 0) {
            return shiFouZuiDaHua ? -99999 : 99999;
        }

        for (let i = 0; i < zouFaLieBiao.length; i++) {
            const zouFa = zouFaLieBiao[i];
            const beiChiQiZi = ChessRules.zhiXingYiDong(
                qiPan, zouFa.qiHang, zouFa.qiLie, zouFa.muBiaoHang, zouFa.muBiaoLie
            );

            const fenShu = alphaBeta(qiPan, shenDu - 1, alpha, beta, !shiFouZuiDaHua, fang);

            ChessRules.cheXiaoYiDong(
                qiPan, zouFa.qiHang, zouFa.qiLie, zouFa.muBiaoHang, zouFa.muBiaoLie, beiChiQiZi
            );

            if (shiFouZuiDaHua) {
                if (fenShu > alpha) alpha = fenShu;
            } else {
                if (fenShu < beta) beta = fenShu;
            }
            
            if (beta <= alpha) break;
        }

        return shiFouZuiDaHua ? alpha : beta;
    }

    /**
     * 获取最佳走法
     */
    function huoQuZuiJiaZouFa(qiPan, fang) {
        console.log('AI开始思考, 深度:', souSuoShenDu);
        const kaiShiShiJian = Date.now();
        
        const zouFaLieBiao = huoQuSuoYouZouFa(qiPan, fang);
        
        if (zouFaLieBiao.length === 0) {
            console.log('AI没有可用走法');
            return null;
        }

        let zuiJiaZouFa = zouFaLieBiao[0];
        let zuiJiaFenShu = -Infinity;

        for (let i = 0; i < zouFaLieBiao.length; i++) {
            const zouFa = zouFaLieBiao[i];
            const beiChiQiZi = ChessRules.zhiXingYiDong(
                qiPan, zouFa.qiHang, zouFa.qiLie, zouFa.muBiaoHang, zouFa.muBiaoLie
            );

            if (beiChiQiZi && beiChiQiZi.leiXing === ChessRules.QI_ZI_LEI_XING.JIANG_SHUAI) {
                ChessRules.cheXiaoYiDong(
                    qiPan, zouFa.qiHang, zouFa.qiLie, zouFa.muBiaoHang, zouFa.muBiaoLie, beiChiQiZi
                );
                console.log('AI找到直接吃将的走法');
                return zouFa;
            }

            const fenShu = alphaBeta(qiPan, souSuoShenDu - 1, -Infinity, Infinity, false, fang);

            ChessRules.cheXiaoYiDong(
                qiPan, zouFa.qiHang, zouFa.qiLie, zouFa.muBiaoHang, zouFa.muBiaoLie, beiChiQiZi
            );

            if (fenShu > zuiJiaFenShu) {
                zuiJiaFenShu = fenShu;
                zuiJiaZouFa = zouFa;
            }
        }

        const yongShi = Date.now() - kaiShiShiJian;
        console.log(`AI思考完成, 耗时: ${yongShi}ms, 最佳分数: ${zuiJiaFenShu}`);

        return zuiJiaZouFa;
    }

    return {
        sheZhiNanDu,
        huoQuZuiJiaZouFa,
        pingGuJuMian
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChessAI;
}
