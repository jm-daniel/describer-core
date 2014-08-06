﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JM.Foundation
{
    public abstract class ContextAttribute : Attribute
    {

    }

    public class SystemBoundaryAttribute : ContextAttribute
    {
        public SystemBoundaryAttribute(string businessContext, BusinesImpact impact)
        {
            this.BusinessContext = businessContext;
            this.Impact = impact;
        }

        public string BusinessContext
        {
            get;
            private set;
        }

        public BusinesImpact Impact
        {
            get;
            private set;
        }
    }

    public enum BusinesImpact
    {
        Low = 0,
        High = 1
    }
}